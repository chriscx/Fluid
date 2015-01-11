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
expressSession = require 'express-session'
expressJwt = require 'express-jwt'
jwt = require 'jsonwebtoken'
bcrypt = require 'bcrypt-nodejs'
busboy = require 'connect-busboy'
toobusy = require 'toobusy'
User = require('./models/user').User
Setting = require('./models/setting').Setting

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

app.use bodyParser.json()
app.use bodyParser.urlencoded(extended: true)

app.use express.static "#{__dirname}/../../client/public"

app.use (req, res, next) ->
  if toobusy()
    res.send 503, "I'm busy right now, sorry."
  else next()

app.use (err, req, res, next) ->
  res.send 401, "invalid token..."  if err.name is "UnauthorizedError"

app.use busboy()
resetTokens = {}

require('./routes') app, passport, resetTokens,
  service: process.env.SMTP_ACCOUNT || 'smtp',
  account: process.env.SMTP_ACCOUNT,
  password: process.env.SMTP_PASSWORD,
  host: process.env.SMTP_HOST || 'localhost',
  port: process.env.SMTP_PORT || 25,
  ssl: process.env.SMTP_SSL || false

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
