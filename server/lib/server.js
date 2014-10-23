var LocalStrategy, User, app, bcrypt, bodyParser, cluster, cookieParser, express, expressJwt, expressSession, fs, i, jwt, methodOverride, mongoose, numCPUs, passport, path, server;

fs = require('fs');

cluster = require('cluster');

numCPUs = require('os').cpus().length;

path = require('path');

express = require('express');

bodyParser = require('body-parser');

cookieParser = require('cookie-parser');

methodOverride = require('method-override');

mongoose = require('mongoose');

passport = require('passport');

LocalStrategy = require('passport-local').Strategy;

expressSession = require('express-session');

expressJwt = require('express-jwt');

jwt = require('jsonwebtoken');

bcrypt = require('bcrypt-nodejs');

User = require('./models/user').User;

app = express();

mongoose.connect(process.env.FLUID_DB);

app.use(expressSession({
  secret: 'This is my secret for express session',
  saveUninitialized: true,
  resave: true
}));

app.use(passport.initialize());

app.use(passport.session());

passport.serializeUser(function(user, done) {
  return done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  return User.findById(id, function(err, user) {
    return done(err, user);
  });
});

passport.use("login", new LocalStrategy({
  passReqToCallback: true
}, function(req, username, password, done) {
  return User.findOne({
    username: username
  }, function(err, user) {
    if (err) {
      return done(err);
    }
    if (!user) {
      console.log("User Not Found with username " + username);
      return done(null, false);
    }
    if (!bcrypt.compareSync(password, user.password)) {
      console.log("Invalid Password");
      return done(null, false);
    }
    return done(null, user);
  });
}));

passport.use('signup', new LocalStrategy({
  passReqToCallback: true
}, function(req, username, password, done) {
  var findOrCreateUser;
  findOrCreateUser = function() {
    return User.findOne({
      'username': username
    }, function(err, user) {
      var newUser;
      if (err) {
        console.log('Error in SignUp: ' + err);
        done(err);
      }
      if (user) {
        console.log('User already exists');
        return done(null, false);
      } else {
        newUser = new User();
        newUser.username = username;
        newUser.password = bcrypt.hashSync(password);
        newUser.firstname = req.param('firstname');
        newUser.lastname = req.param('lastname');
        newUser.email = req.param('email');
        newUser.country = req.param('country');
        return newUser.save(function(err) {
          if (err) {
            console.log('Error in Saving user: ' + err);
            throw err;
          }
          console.log('User Registration succesful');
          return done(null, newUser);
        });
      }
    });
  };
  return process.nextTick(findOrCreateUser);
}));

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(bodyParser.json());

app.use(express["static"]("" + __dirname + "/../../client/public"));

app.use('/data', expressJwt({
  secret: 'this is my secret for jwt'
}));

app.use(function(err, req, res, next) {
  if (err.name === "UnauthorizedError") {
    return res.send(401, "invalid token...");
  }
});

require('./routes')(app, passport);

app.use(function(err, req, res, next) {
  console.log('error');
  console.error(err);
  return res.send(500, {
    message: err.message
  });
});

if (cluster.isMaster) {
  i = 0;
  while (i < numCPUs) {
    cluster.fork();
    i++;
  }
  cluster.on("exit", function(worker, code, signal) {
    console.log("worker " + worker.process.pid + " died");
  });
} else {
  server = require('http').Server(app);
  server.listen(process.env.PORT || 5000);
}
