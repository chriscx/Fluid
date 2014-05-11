http = require 'http'
http.globalAgent.maxSockets = 64
https = require 'https'
fs = require 'fs'
stylus = require 'stylus'
express = require 'express'
config = require './config'
routes = require './controllers/routes'
underscore = require 'underscore'
sha1 = require 'sha1'
connect = require 'connect'
mongoose = require 'mongoose'
passport = require 'passport'
Account = require('./models/account').Account

SessionStore = require('session-mongoose')(connect)
store = new SessionStore(
  url: 'mongodb://' + config.mongo.development.host + '/' + config.mongo.production.db + '_session'
  interval: 120000 # expiration check worker run interval in millisec (default: 60000)
)
if config.env is 'development'
  db_url = 'mongodb://' + config.mongo.development.host + '/' + config.mongo.development.db
else
  db_url = 'mongodb://' + config.mongo.production.host + '/' + config.mongo.production.db
mongoose.connect db_url
app = express()
app.set 'views', __dirname + '/views'
app.set 'view engine', 'jade'
app.use express.bodyParser()
app.use express.methodOverride()
app.use express.cookieParser(config.secret)
app.use express.session(
  secret: config.secret
  store: store
)
app.use app.router
app.use stylus.middleware('' + __dirname + '/../public')
app.use express.static('' + __dirname + '/../public')
app.use express.errorHandler(
  showStack: true
  dumpExceptions: true
)

passport.use Account.createStrategy()

passport.serializeUser Account.serializeUser()
passport.deserializeUser Account.deserializeUser()

app.locals.moment = require('moment')
routes.blog app  if config.blog.enabled
routes.site app
routes.login app
routes.error app
if config.ssl.enabled
  options =
    key: fs.readFileSync(config.ssl.key)
    cert: fs.readFileSync(config.ssl.cert)

  https.createServer(options, app).listen config.port, ->
    console.log 'https://localhost:' + config.port

else
  http.createServer(app).listen config.port, ->
    console.log 'http://localhost:' + config.port
