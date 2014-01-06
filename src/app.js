var app, checkAuth, connect, ConnectCouchDB, store, express, http, metrics, stylus, underscore, user, user_metrics;

http = require('http');
stylus = require('stylus');
express = require('express');
user = require('./user');
underscore = require('underscore');
connect = require('connect'),
ConnectCouchDB = require('connect-couchdb')(connect);
store = new ConnectCouchDB({
  // Name of the database you would like to use for sessions.
  name: 'fluiddb_sessions',

  // Optional. How often expired sessions should be cleaned up.
  // Defaults to 600000 (10 minutes).
  reapInterval: 600000,

  // Optional. How often to run DB compaction against the session
  // database. Defaults to 300000 (5 minutes).
  // To disable compaction, set compactInterval to -1
  compactInterval: 300000,

  // Optional. How many time between two identical session store
  // Defaults to 60000 (1 minute)
  setThrottle: 60000
});

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
}));
app.use(app.router);
app.use(stylus.middleware("" + __dirname + "/../public"));
app.use(express["static"]("" + __dirname + "/../public"));
app.use(express.errorHandler({
  showStack: true,
  dumpExceptions: true
}));

checkAuth = function(req, res, next) {
  var actualTimestamp;
  actualTimestamp = (new Date()).getTime();
  if (!(req.session.logged_in === true && actualTimestamp < req.session.expirationDate)) {
    return res.redirect("/login");
  } else {
    return next();
  }
};

app.get('/', checkAuth, function(req, res) {
  return res.render('index', {
    title: 'Fluid'
  });
});

app.get("/login", function(req, res) {
  return res.render('login', {
    title: 'Fluid'
  });
});

app.post("/login", function(req, res, next) {
  var _data;
  _data = null;
  return user.get(req.body.login, function(err, data) {
    var expirationTimestamp;
    if (err) {
      return next(err);
    }
    req.session.logged_in = true;
    req.session.username = req.body.login;
    expirationTimestamp = (new Date()).getTime();
    req.session.expirationDate = expirationTimestamp + 30 * 60 * 1000;
    return res.redirect('/');
  });
});

app.get("/logout", checkAuth, function(req, res) {
  delete req.session.logged_in;
  return res.redirect("/login");
});

http.createServer(app).listen(3333, function() {
  return console.log('http://localhost:3333');
});
