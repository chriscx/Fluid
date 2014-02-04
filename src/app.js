var app, checkAuth, mongoose, connect, SessionStore, store, express, http, stylus, underscore, user, blog, config, sha1, db_url, routes;

http = require('http');
stylus = require('stylus');
express = require('express');

user = require('../lib/user');
blog = require('../lib/blog');
config = require('../config');
routes = require('../lib/routes');

underscore = require('underscore');
sha1 = require('sha1');
connect = require('connect'),
mongoose = require('mongoose');
SessionStore = require("session-mongoose")(connect);
store = new SessionStore({
    url: "mongodb://localhost/session",
    interval: 120000 // expiration check worker run interval in millisec (default: 60000)
});

if(config.env == 'development') {
  db_url = 'mongodb://localhost/fluiddb_dev';
} else {
  db_url = 'mongodb://localhost/fluiddb';
}

mongoose.connect(db_url);

app = express();
app.set('views', __dirname + '/../views');
app.set('view engine', 'jade');
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('DD9E5F7F98E47AD47932ACBF77912'));
app.use(express.session({
  secret: 'DD9E5F7F98E47AD47932ACBF77912',
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

if(config.blog.enabled)
  routes.blog(app);
routes.site(app);
routes.login(app);
routes.error(app);

http.createServer(app).listen(3333, function() {
  return console.log('http://localhost:3333');
});
