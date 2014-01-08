var app, checkAuth, connect, SessionStore, store, express, http, stylus, underscore, user;

http = require('http');
stylus = require('stylus');
express = require('express');
user = require('./user');
underscore = require('underscore');
connect = require('connect'),
SessionStore = require("session-mongoose")(connect);
store = new SessionStore({
    url: "mongodb://localhost/session",
    interval: 120000 // expiration check worker run interval in millisec (default: 60000)
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
