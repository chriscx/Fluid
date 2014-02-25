var app, checkAuth, mongoose, connect, SessionStore, store, express, http, https, stylus, underscore, user, blog, config, sha1, db_url, routes, fs;

http  = require('http');
http.globalAgent.maxSockets = 64;
https = require('https');
fs    = require('fs');

stylus  = require('stylus');
express = require('express');

user    = require('../lib/user');
blog    = require('../lib/blog');
config  = require('../config');
routes  = require('../lib/routes');

underscore    = require('underscore');
sha1          = require('sha1');
connect       = require('connect'),
mongoose      = require('mongoose');
SessionStore  = require("session-mongoose")(connect);
store = new SessionStore({
    url: 'mongodb://' + config.mongo.development.host + '/' + config.mongo.production.db + "_session",
    interval: 120000 // expiration check worker run interval in millisec (default: 60000)
});

if(config.env == 'development') {
  db_url = 'mongodb://' + config.mongo.development.host + '/' + config.mongo.development.db;
} else {
  db_url = 'mongodb://' + config.mongo.production.host + '/' + config.mongo.production.db;
}

mongoose.connect(db_url);

app = express();
app.set('views', __dirname + '/../views');
app.set('view engine', 'jade');
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser(config.secret));
app.use(express.session({
  secret: config.secret,
  store: store
  })
);
app.use(app.router);
app.use(stylus.middleware("" + __dirname + "/../public"));
app.use(express["static"]("" + __dirname + "/../public"));
app.use(express.errorHandler({
  showStack: true,
  dumpExceptions: true
}));
app.locals.moment = require('moment');

if(config.blog.enabled)
  routes.blog(app);

routes.site(app);
routes.login(app);
routes.error(app);

if(config.ssl.enabled) {
  var options = {
    key: fs.readFileSync(config.ssl.key),
    cert: fs.readFileSync(config.ssl.cert)
  };
  https.createServer(options, app).listen(config.port, function() {
    return console.log('https://localhost:' + config.port);
  });
} else {
  http.createServer(app).listen(config.port, function() {
    return console.log('http://localhost:' + config.port);
  });
}
