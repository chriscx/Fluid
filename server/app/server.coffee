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

ln = require('ln')
ln.PIPE_BUFF = 512
appenders = [
  {
    'level': 'info'
    'type': 'file'
    'path': '[./fluid.log]'
    'isUTC': true
  }
  {
    'level': 'info'
    'type': 'console'
  }
]
logger = new ln('fluid', appenders)

app = express()

mongoose.connect process.env.DB, (err) ->
  if(err)
    logger.fatal new Error(err), {msg: "Can't connect to MongoDB"}
    for id in cluster.workers
      cluster.workers[id].kill()
      logger.fatal {msg: 'worker ' + id + ' killed.'}
    process.exit 0

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

require('./routes') app, passport, resetTokens, conf, logger

app.use (err, req, res, next) ->
  logger.error 'Ressources not found.'
  res.send 500,
    message: err.message

port = process.env.PORT || 5000
if cluster.isMaster
  # Fork workers.
  i = 0
  logger.info 'Server starting with ' + numCPUs + ' workers'
  while i < numCPUs
    cluster.fork()
    i++
  cluster.on "exit", (worker, code, signal) ->

    logger.error {code: code, signal: signal msg: "worker " + worker.process.pid + " died"}
    return
  logger.info 'Server is running on port ' + port + '.'
else
  server = require('http').Server(app)
  server.listen port
  logger.info 'Starting workers...'
