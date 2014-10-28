var Category, Menu, Page, Post, User, crypto, expressJwt, jwt, nodemailer, path, utils;

path = require('path');

expressJwt = require('express-jwt');

jwt = require('jsonwebtoken');

nodemailer = require('nodemailer');

crypto = require('crypto');

utils = require('./utils');

User = require('./models/user').User;

Page = require('./models/page').Page;

Menu = require('./models/menu').Menu;

Post = require('./models/blog').Post;

Category = require('./models/category').Category;

module.exports = function(app, passport) {
  app.get('/data/user/:user.json', function(req, res) {
    console.log('GET user \'' + req.user.username + '\' JSON object');
    return User.findOne({
      username: req.user.username
    }, '-_id -__v', function(err, data) {
      delete data.password;
      if (err) {
        return res.send(500).end();
      } else if (data.length < 1) {
        return res.send(404).end();
      } else {
        return res.json(data);
      }
    });
  });
  app.put('/data/user/:user.json', function(req, res) {
    console.log('PUT user \'' + req.user.username + '\' JSON object');
    return User.findOneAndUpdate({
      username: req.user.username
    }, req.body, {
      "new": true
    }, function(err, data) {
      if (err) {
        return res.send(500).end();
      } else if (data.length < 1) {
        return res.send(404).end();
      } else {
        return res.send(200).end();
      }
    });
  });
  app["delete"]('/data/user/:user.json', function(req, res) {
    console.log('DEL user \'' + req.user.username + '\' JSON object');
    return User.remove({
      'username': req.user.username
    }, function(err, data) {
      if (err) {
        return res.send(500).end();
      } else if (data.length < 1) {
        return res.send(404).end();
      } else {
        return res.send(200).end();
      }
    });
  });
  app.get('/data/blog/posts.json', function(req, res) {
    console.log('GET playlist list JSON object');
    return Post.find({
      author: req.user.username
    }, 'id title category -_id -__v', function(err, data) {
      if (!err) {
        return res.json(data);
      } else {
        return res.send(404).end();
      }
    });
  });
  app.get('/data/blog/post/:s/:l/posts.json', function(req, res) {
    return Post.find({}, '-_id -__v', {
      'skip': req.params.s,
      'limit': req.params.l
    }).sort({
      creationDate: 'desc'
    }).exec(function(err, data) {
      if (err) {
        return res.send(500).end();
      } else if (data.length < 1) {
        return res.send(404).end();
      } else {
        return res.json(data);
      }
    });
  });
  app.get('/data/blog/post/:id.json', function(req, res) {
    return Post.findOne({
      'id': req.params.id
    }, '-_id -__v', function(err, data) {
      if (err) {
        return res.send(500).end();
      } else if (data.length < 1) {
        return res.send(404).end();
      } else {
        return res.json(data);
      }
    });
  });
  app.post('/data/blog/post/', function(req, res) {
    var newPost;
    newPost = new Post({
      title: req.body.title,
      author: req.body.author,
      id: utils.slugify(req.body.title),
      body: req.body.body,
      tags: req.body.tags,
      Category: 'test',
      comments: [],
      creationDate: new Date(),
      updateDate: null,
      published: req.body.published
    });
    return newPost.save(function(err) {
      if (err) {
        return res.send(500).end();
      } else if (data.length < 1) {
        return res.send(404).end();
      } else {
        return res.send(200).end();
      }
    });
  });
  app.put('/data/blog/post/:id.json', function(req, res) {
    console.log('update -> ');
    console.log(req.body);
    return Post.findOneAndUpdate({
      'id': req.params.id
    }, req.body, {
      "new": true
    }, function(err, data) {
      if (err) {
        return res.send(500).end();
      } else if (data.length < 1) {
        return res.send(404).end();
      } else {
        return res.end(200).end();
      }
    });
  });
  app["delete"]('/data/blog/post/:id.json', function(req, res) {
    return Post.remove({
      'id': req.params.id
    }, function(err, data) {
      if (err) {
        return res.send(500).end();
      } else if (data.length < 1) {
        return res.send(404).end();
      } else {
        return res.send(200).end();
      }
    });
  });
  app.get('/data/blog/tag/:name/posts.json', function(req, res) {
    return Post.find({
      'tags.name': req.params.name
    }, '-_id -__v', function(err, data) {
      if (err) {
        return res.send(500).end();
      } else if (data.length < 1) {
        return res.send(404).end();
      } else {
        return res.json(data);
      }
    });
  });
  app.get('/data/blog/category/:name/posts.json', function(req, res) {
    return Post.find({
      'category': req.params.name
    }, '-_id -__v', function(err, data) {
      if (err) {
        return res.send(500).end();
      } else if (data.length < 1) {
        return res.send(404).end();
      } else {
        return res.json(data);
      }
    });
  });
  app.get('/data/blog/categories.json', function(req, res) {
    return Category.find({}, '-_id -__v', function(err, data) {
      if (err) {
        return res.send(500).end();
      } else if (data.length < 1) {
        return res.send(404).end();
      } else {
        return res.json(data);
      }
    });
  });
  app.get('/data/blog/category/:name.json', function(req, res) {
    return Category.findOne({
      name: req.params.name
    }, '-_id -__v', function(err, data) {
      if (err) {
        return res.send(500).end();
      } else if (data.length < 1) {
        return res.send(404).end();
      } else {
        return res.json(data);
      }
    });
  });
  app.post('/data/blog/category/', function(req, res) {
    var newCategory;
    newCategory = new Category({
      name: req.body.name,
      description: req.body.description
    });
    return newCategory.save(function(err) {
      if (err) {
        return res.send(500).end();
      } else if (data.length < 1) {
        return res.send(404).end();
      } else {
        return res.send(200).end();
      }
    });
  });
  app.put('/data/blog/category/:name.json', function(req, res) {
    return Category.findOneAndUpdate({
      'name': req.params.name
    }, req.body, {
      "new": true
    }, function(err, data) {
      if (err) {
        return res.send(500).end();
      } else if (data.length < 1) {
        return res.send(404).end();
      } else {
        return res.send(200).end();
      }
    });
  });
  app["delete"]('/data/blog/category/:name.json', function(req, res) {
    return Category.remove({
      'name': req.params.name
    }, function(err, data) {
      if (err) {
        return res.send(500).end();
      } else if (data.length < 1) {
        return res.send(404).end();
      } else {
        return res.send(200).end();
      }
    });
  });
  app.get('/menu.json', function(req, res) {
    return Menu.find({}, function(err, data) {
      if (err) {
        return res.send(500).end();
      } else if (data.length < 1) {
        return res.send(404).end();
      } else {
        return res.json(data);
      }
    });
  });
  app.get('/data/pages.json', function(req, res) {
    return Page.find({}, 'route title', function(err, data) {
      if (err) {
        return res.send(500).end();
      } else if (data.length < 1) {
        return res.send(404).end();
      } else {
        return res.json(data);
      }
    });
  });
  app.get('/data/page/:route.json', function(req, res) {
    return Page.find({
      route: req.params.route
    }, function(err, data) {
      if (err) {
        return res.send(500).end();
      } else if (data.length < 1) {
        return res.send(404).end();
      } else {
        return res.json(data);
      }
    });
  });
  app.post('/data/page/', function(req, res) {
    var newPage;
    newPage = new Page({
      title: req.body.title,
      author: req.body.author,
      route: utils.slugify(req.body.title),
      body: req.body.body,
      creationDate: new Date(),
      updateDate: null,
      published: req.body.published
    });
    return newPage.create(function(err, data) {
      if (err) {
        return res.send(500).end();
      } else if (data.length < 1) {
        return res.send(404).end();
      } else {
        return res.send(200).end();
      }
    });
  });
  app.put('/data/page/:route.json', function(req, res) {
    console.log('update -> ');
    console.log(req.body);
    return Page.findOneAndUpdate({
      route: req.params.route
    }, req.body, {
      "new": true
    }, function(err, data) {
      if (err) {
        return res.send(500).end();
      } else if (data.length < 1) {
        return res.send(404).end();
      } else {
        return res.send(200).end();
      }
    });
  });
  app["delete"]('/data/page/:route.json', function(req, res) {
    return Page.remove({
      route: req.params.route
    }, function(err, data) {
      if (err) {
        return res.send(500).end();
      } else if (data.length < 1) {
        return res.send(404).end();
      } else {
        return res.send(200).end();
      }
    });
  });
  app.post('/signup', function(req, res, next) {
    console.log('POST signup');
    return passport.authenticate('signup', function(err, user, info) {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.send(409).end();
      }
      return req.logIn(user, function(err) {
        if (err) {
          return next(err);
        }
        return res.send(201).end();
      });
    })(req, res, next);
  });
  app.post('/login', function(req, res, next) {
    console.log('POST login');
    return passport.authenticate('login', function(err, user, info) {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.send(401).end();
      }
      return req.logIn(user, function(err) {
        var profile, token;
        if (err) {
          return next(err);
        }
        console.log('user' + user);
        profile = {
          username: user.username,
          firstname: user.firstname,
          lastname: user.lastname,
          country: user.country
        };
        token = jwt.sign(profile, 'this is my secret for jwt', {
          expiresInMinutes: 60 * 5
        });
        return res.json({
          token: token,
          user: profile
        });
      });
    })(req, res, next);
  });
  app.post('/forgot', function(req, res, next) {
    return User.findOne({
      username: req.user.username
    }, function(err, user) {
      var mailOptions, smtpTransport, token;
      if (err) {
        return res.send(500).end();
      } else if (data.length < 1) {
        return res.send(404).end();
      } else {
        crypto.randomBytes(20, function(err, buf) {});
        token = buf.toString("hex");
        smtpTransport = nodemailer.createTransport();
        mailOptions = {
          to: user.email,
          from: 'passwordreset@demo.com',
          subject: 'Fluid Password Reset',
          text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' + 'Please click on the following link, or paste this into your browser to complete the process:\n\n' + 'http://' + req.headers.host + '/reset/' + token + '\n\n' + 'If you did not request this, please ignore this email and your password will remain unchanged.\n'
        };
        return smtpTransport.sendMail(mailOptions, function(err) {
          if (!err) {
            return res.send(200).end();
          } else {
            return res.send(500).end();
          }
        });
      }
    });
  });
  app.post('/reset', function(req, res, next) {
    console.log('POST reset');
    return passport.authenticate('reset', function(err, user, info) {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.send(401).end();
      }
      return req.logIn(user, function(err) {
        var profile, token;
        if (err) {
          return next(err);
        }
        console.log('user' + user);
        profile = {
          username: user.username,
          firstname: user.firstname,
          lastname: user.lastname,
          country: user.country
        };
        token = jwt.sign(profile, 'this is my secret for jwt', {
          expiresInMinutes: 60 * 5
        });
        return res.json({
          token: token,
          user: profile
        });
      });
    })(req, res, next);
  });
  return app.get('*', function(req, res) {
    console.log('GET ' + req.originalUrl + ' redirect to ' + '/#' + req.originalUrl);
    return res.redirect('/#' + req.originalUrl);
  });
};
