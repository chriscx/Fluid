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
bunyan = require 'bunyan'
log = bunyan.createLogger {name: "fluid"}

app = express()

mongoose.connect process.env.DB, (err) ->
  log.fatal err
  process.exit 1

app.use expressSession(
  secret: process.env.SECRET || 'This is my secret for express session'
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
    log.error 'Unable to serve all requests.'
    res.send 503, "I'm busy right now, sorry."
  else next()

app.use (err, req, res, next) ->
  res.send 401, "invalid token..."  if err.name is "UnauthorizedError"

app.use busboy()
resetTokens = {}

conf =
  service: process.env.SMTP_ACCOUNT || 'smtp',
  account: process.env.SMTP_ACCOUNT,
  password: process.env.SMTP_PASSWORD,
  host: process.env.SMTP_HOST || 'localhost',
  port: process.env.SMTP_PORT || 25,
  ssl: process.env.SMTP_SSL || false

require('./routes') app, passport, resetTokens, conf, log


app.use (err, req, res, next) ->
  log.error 'Ressources not found.'
  res.send 500,
    message: err.message

if cluster.isMaster
  # Fork workers.
  i = 0
  while i < numCPUs
    cluster.fork()
    i++
  cluster.on "exit", (worker, code, signal) ->

    log.error {code: code, signal: signal}, "worker " + worker.process.pid + " died"
    return

else
  server = require('http').Server(app)
  port = process.env.PORT || 5000
  server.listen port
  log.info 'Server is running on port ' + port + '.'
