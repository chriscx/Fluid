var app, checkAuth, mongoose, connect, SessionStore, store, express, http, stylus, underscore, user, blog, sha1;

http = require('http');
stylus = require('stylus');
express = require('express');
user = require('../lib/user');
blog = require('../lib/blog');
underscore = require('underscore');
sha1 = require('sha1');
connect = require('connect'),
mongoose = require('mongoose');
SessionStore = require("session-mongoose")(connect);
store = new SessionStore({
    url: "mongodb://localhost/session",
    interval: 120000 // expiration check worker run interval in millisec (default: 60000)
});

mongoose.connect('mongodb://localhost/fluiddb_test');

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

checkAuth = function(req, res, next) {
  var actualTimestamp;
  actualTimestamp = (new Date()).getTime();
  if (!(req.session.logged_in === true && actualTimestamp < req.session.expirationDate)) {
    return res.redirect("/login");
  } else {
    return next();
  }
};

/*
 Get index page
*/
app.get('/', checkAuth, function(req, res) {
  return res.render('index', {
    title: 'Fluid'
  });
});

/*
 Get login page
*/
app.get("/login", function(req, res) {
  return res.render('login', {
    title: 'Fluid'
  });
});

/*
 Get admin page
*/
app.get("/admin", function(req, res) {
  return res.render('admin', {
    title: 'Fluid Admin'
  })
});

/*
 Post login
*/
app.post("/login", function(req, res, next) {
  var _data;
  _data = null;
  return user.checkPassword(req.body.login, sha1(req.body.password), function(err, data) {
    var expirationTimestamp;
    if (err) {
      return next(err);
    }
    if(data.check) {
      req.session.logged_in = true;
      req.session.userId = data.userId;
      expirationTimestamp = (new Date()).getTime();
      req.session.expirationDate = expirationTimestamp + 30 * 60 * 1000;
      req.session.login = req.body.email;
      return res.redirect('/');
    }
    else {
      return res.redirect('/login');
    }
  });
});

/*
 Get blog page
*/
app.get("/blog", function(req, res) {
  return res.render('blog');
});

/*
 get specific blog post
*/
app.get("/blog/post/:uri", function(req, res) {
  console.log(req.params.uri);
  blog.getEntry({url: "test-request-blog-post"}, function(err, data) {
    console.log(err);
    console.log(data);
    if(data.length > 0) {
      return res.render('post', {
        data: data
      });
    }
    else {
      res.redirect('error/404');
    }
  });
});

/*
 Post create blog post
*/
app.post("/blog/post/create", function(req, res) {
  var entry, title;
  title = (JSON.parse(req.body)).title;
  entry = { 
    title: title,
    author: req.session.userId, 
    url: encodeURI(title.toLowerCase()),
    body: "",
    tags: [],
    category: null,
    comments: [],
    creationDate: new Date(),
    updateDate: null,
    published: true
  };

  return blog.createEntry(entry, function(err, data) {
    if(err) {
      res.json(err);
    }
    res.json(data);
  });
});

/*
 Update blog post
*/
app.put("/blog/post/:id", function(req, res) {
  return blog.editEntry(req.param.id, JSON.parse(req.body), function(err, data) {
    if(data.length > 0) {
      return res.json({
        result: 'OK'
      });
    }
    else {
      res.redirect('error/404');
    }
  });
});

/*
 Delete blog post
*/
app.del("/blog/post/:id", function(req, res) {
  return blog.removeEntry(req.param.id, function(err, data) {
    if(data.length > 0) {
      return res.json({
        result: 'OK'
      });
    }
    else {
      res.redirect('error/404');
    }
  });
});

/*
 Logout page
*/
app.get("/logout", checkAuth, function(req, res) {
  delete req.session.logged_in;
  return res.redirect("/login");
});

/*
 error redirection page
*/
app.get("/error/:error", function(req, res) {
  return res.render('error', {
    error: req.param.error
  });
});

http.createServer(app).listen(3333, function() {
  return console.log('http://localhost:3333');
});
