fs = require 'fs'
cluster = require 'cluster'
numCPUs = require('os').cpus().length
path = require 'path'
express = require 'express'
bodyParser = require 'body-parser'
cookieParser = require 'cookie-parser'
methodOverride = require 'method-override'
mongoose = require 'mongoose'
passport = require 'passport'
LocalStrategy = require('passport-local').Strategy
expressSession = require 'express-session'
expressJwt = require 'express-jwt'
jwt = require 'jsonwebtoken'
bcrypt = require 'bcrypt-nodejs'
busboy = require 'connect-busboy'
User = require('./models/user').User

app = express()

mongoose.connect process.env.DB

app.use expressSession(
  secret: 'This is my secret for express session'
  saveUninitialized: true,
  resave: true
)
app.use passport.initialize()
app.use passport.session()

passport.serializeUser (user, done) ->
  done null, user._id

passport.deserializeUser (id, done) ->
  User.findById id, (err, user) ->
    done err, user

passport.use "login", new LocalStrategy(
  passReqToCallback: true
, (req, username, password, done) ->

  # check in mongo if a user with username exists or not
  User.findOne
    username: username
  , (err, user) ->

    # In case of any error, return using the done method
    return done err if err

    # Username does not exist, log error & redirect back
    unless user
      console.log "User Not Found with username " + username
      return done null, false

    # User exists but wrong password, log the error
    unless bcrypt.compareSync password, user.password
      console.log "Invalid Password"
      return done null, false

    # User and password both match, return user from
    # done method which will be treated like success
    console.log 'user:'
    console.log user
    done null, user
)

passport.use 'signup', new LocalStrategy(
    passReqToCallback : true
, (req, username, password, done) ->
    findOrCreateUser = () ->
      # find a user in Mongo with provided username
      User.findOne 'username': username, (err, user) ->
        # In case of any error return
        if err
          console.log 'Error in SignUp: ' + err
          done err

        # already exists
        if user
          console.log 'User already exists'
          done null, false
        else
          # if there is no user with that email
          # create the user
          newUser = new User()
          # set the user's local credentials
          newUser.username = username
          newUser.password = bcrypt.hashSync password
          newUser.firstname = req.param 'firstname'
          newUser.lastname = req.param 'lastname'
          newUser.email = req.param 'email'

          # save the user
          newUser.save (err) ->
            if err
              console.log 'Error in Saving user: ' + err
              throw err
            console.log('User Registration succesful');
            done null, newUser

    # Delay the execution of findOrCreateUser and execute
    # the method in the next tick of the event loop
    process.nextTick findOrCreateUser
)

passport.use 'reset', new LocalStrategy(
  passReqToCallback: true
, (req, username, password, done) ->

  updatedPassword = {password: bcrypt.hashSync password}

  # check in mongo if a user with username exists or not
  User.findOneAndUpdate
    username: username,
    updatedPassword
  , (err, user) ->

    # In case of any error, return using the done method
    return done err if err

    # Username does not exist, log error & redirect back
    unless user
      console.log "User Not Found with username " + username
      return done null, false

    done null, user
)

app.use bodyParser.json()
app.use bodyParser.urlencoded(extended: true)

app.use express.static "#{__dirname}/../../client/public"

app.use (err, req, res, next) ->
  res.send 401, "invalid token..."  if err.name is "UnauthorizedError"

app.use busboy()

require('./routes') app, passport

app.use (err, req, res, next) ->
  console.log 'error'
  console.error err
  res.send 500,
    message: err.message

if cluster.isMaster
  # Fork workers.
  i = 0
  while i < numCPUs
    cluster.fork()
    i++
  cluster.on "exit", (worker, code, signal) ->
    console.log "worker " + worker.process.pid + " died"
    return

else
  server = require('http').Server(app)
  server.listen process.env.PORT || 5000
