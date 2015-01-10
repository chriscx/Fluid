var File, Hashids, Menu, Page, Post, Setting, User, bcrypt, crypto, expressJwt, fs, hash, jwt, markdown, nodemailer, path, secret, smtpTransport, utils;

path = require('path');

fs = require('fs');

expressJwt = require('express-jwt');

jwt = require('jsonwebtoken');

nodemailer = require('nodemailer');

smtpTransport = require('nodemailer-smtp-transport');

crypto = require('crypto');

Hashids = require('hashids');

hash = new Hashids('this is my salt');

markdown = require('markdown').markdown;

bcrypt = require('bcrypt-nodejs');

utils = require('./utils');

User = require('./models/user').User;

Page = require('./models/page').Page;

Menu = require('./models/menu').Menu;

Post = require('./models/blog').Post;

Setting = require('./models/setting').Setting;

File = require('./models/file').File;

secret = 'this is my secret for jwt';

module.exports = function(app, passport, resetTokens, smtp) {
  app.get('/data/user/:user.json', expressJwt({
    secret: secret
  }), function(req, res) {
    console.log('GET user \'' + req.user.username + '\' JSON object');
    return User.findOne({
      username: req.user.username
    }, '-_id -__v -password', function(err, data) {
      delete data.password;
      if (err) {
        return res.sendStatus(500).end();
      } else if (data === undefined) {
        return res.sendStatus(404).end();
      } else {
        return res.json(data);
      }
    });
  });
  app.put('/data/user/:user.json', expressJwt({
    secret: secret
  }), function(req, res) {
    console.log('PUT user \'' + req.user.username + '\' JSON object');
    req.body.password = bcrypt.hashSync(req.body.password);
    return User.findOneAndUpdate({
      username: req.user.username
    }, req.body, {
      "new": true
    }, function(err, data) {
      if (err) {
        return res.sendStatus(500).end();
      } else if (data === undefined) {
        return res.sendStatus(404).end();
      } else {
        return res.sendStatus(200).end();
      }
    });
  });
  app["delete"]('/data/user/:user.json', expressJwt({
    secret: secret
  }), function(req, res) {
    console.log('DEL user \'' + req.user.username + '\' JSON object');
    return User.remove({
      'username': req.user.username
    }, function(err, data) {
      if (err) {
        return res.sendStatus(500).end();
      } else if (data.length < 1) {
        return res.sendStatus(404).end();
      } else {
        return res.sendStatus(200).end();
      }
    });
  });
  app.get('/data/blog/posts.json', expressJwt({
    secret: secret
  }), function(req, res) {
    console.log('GET playlist list of \'' + req.user.username + '\' JSON object');
    return Post.find({
      author: req.user.username
    }, 'id title category', function(err, data) {
      console.log(data);
      if (!err) {
        return res.json(data);
      } else {
        return res.sendStatus(404).end();
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
        return res.sendStatus(500).end();
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
        return res.sendStatus(500).end();
      } else {
        return res.json(data);
      }
    });
  });
  app.post('/data/blog/post/', expressJwt({
    secret: secret
  }), function(req, res) {
    var newPost;
    console.log(req.body);
    newPost = new Post({
      title: req.body.title,
      author: req.body.author,
      id: utils.slugify(req.body.title),
      body: markdown.toHTML(req.body.body),
      content: req.body.body,
      tags: req.body.tags,
      Category: 'test',
      comments: [],
      creationDate: new Date(),
      updateDate: null,
      published: req.body.published
    });
    return newPost.save(function(err) {
      if (err) {
        console.log(err);
        return res.sendStatus(500).end();
      } else {
        return res.sendStatus(200).end();
      }
    });
  });
  app.put('/data/blog/post/:id.json', expressJwt({
    secret: secret
  }), function(req, res) {
    var data;
    data = req.body;
    data.id = utils.slugify(data.title);
    data.body = markdown.toHTML(data.content);
    return Post.findOneAndUpdate({
      'id': req.params.id
    }, data, {
      "new": true
    }, function(err, data) {
      if (err) {
        return res.sendStatus(500).end();
      } else if (data === undefined) {
        return res.sendStatus(404).end();
      } else {
        return res.sendStatus(200).end();
      }
    });
  });
  app["delete"]('/data/blog/post/:id.json', expressJwt({
    secret: secret
  }), function(req, res) {
    return Post.remove({
      'id': req.params.id
    }, function(err, data) {
      if (err) {
        return res.sendStatus(500).end();
      } else if (data.length < 1) {
        return res.sendStatus(404).end();
      } else {
        return res.sendStatus(200).end();
      }
    });
  });
  app.get('/data/blog/tag/:name/posts.json', function(req, res) {
    return Post.find({
      'tags.name': req.params.name
    }, '-_id -__v', function(err, data) {
      if (err) {
        return res.sendStatus(500).end();
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
        return res.sendStatus(500).end();
      } else {
        return res.json(data);
      }
    });
  });
  app.get('/data/blog/categories.json', function(req, res) {
    return Post.find({}).distinct('category', function(err, data) {
      if (err) {
        return res.sendStatus(500).end();
      } else {
        return res.json(data);
      }
    });
  });
  app.get('/data/menu.json', function(req, res) {
    return Menu.find({}, '-_id -__v', function(err, data) {
      if (err) {
        return res.sendStatus(500).end();
      } else {
        return res.json(data);
      }
    });
  });
  app.get('/data/menu/:id.json', function(req, res) {
    return Menu.findOne({
      id: req.params.id
    }, '-_id -__v', function(err, data) {
      if (err) {
        return res.sendStatus(500).end();
      } else {
        return res.json(data);
      }
    });
  });
  app.post('/data/menu/', function(req, res) {
    var newMenu;
    newMenu = new Menu({
      id: utils.slugify(req.body.name),
      name: req.body.name,
      route: req.body.route,
      description: req.body.description,
      order: req.body.order
    });
    return newMenu.save(function(err) {
      if (err) {
        return res.sendStatus(500).end();
      } else {
        return res.sendStatus(200).end();
      }
    });
  });
  app.put('/data/menu/:id.json', function(req, res) {
    return Menu.findOneAndUpdate({
      id: req.params.id
    }, req.body, {
      "new": true
    }, function(err, data) {
      if (err) {
        return res.sendStatus(500).end();
      } else {
        return res.sendStatus(200).end();
      }
    });
  });
  app["delete"]('/data/menu/:id.json', function(req, res) {
    return Menu.remove({
      id: req.params.id
    }, function(err, data) {
      if (err) {
        return res.sendStatus(500).end();
      } else if (data.length < 1) {
        return res.sendStatus(404).end();
      } else {
        return res.sendStatus(200).end();
      }
    });
  });
  app.get('/data/settings.json', function(req, res) {
    return Setting.findOne({}, '-_id -__v', function(err, data) {
      if (err) {
        return res.sendStatus(500).end();
      } else {
        return res.json(data);
      }
    });
  });
  app.post('/data/settings.json', function(req, res) {
    var newSetting, set;
    set = req.body;
    set.header.body = markdown.toHTML(set.header.content);
    set.footer.body = markdown.toHTML(set.footer.content);
    newSetting = new Setting(set);
    return newSetting.save(function(err) {
      if (err) {
        return res.sendStatus(500).end();
      } else {
        return res.sendStatus(200).end();
      }
    });
  });
  app.put('/data/settings.json', function(req, res) {
    var set;
    set = req.body;
    set.header.body = markdown.toHTML(set.header.content);
    set.footer.body = markdown.toHTML(set.footer.content);
    return Setting.findOneAndUpdate({}, set, {
      "new": true
    }, function(err, data) {
      if (err) {
        return res.sendStatus(500).end();
      } else {
        return res.sendStatus(200).end();
      }
    });
  });
  app["delete"]('/data/settings.json', function(req, res) {
    return Setting.remove({}, function(err, data) {
      if (err) {
        return res.sendStatus(500).end();
      } else if (data.length < 1) {
        return res.sendStatus(404).end();
      } else {
        return res.sendStatus(200).end();
      }
    });
  });
  app.get('/data/pages.json', function(req, res) {
    return Page.find({}, 'route title', function(err, data) {
      if (err) {
        return res.sendStatus(500).end();
      } else {
        return res.json(data);
      }
    });
  });
  app.get('/data/page/:route.json', function(req, res) {
    return Page.findOne({
      route: req.params.route
    }, '-_id -__v', function(err, data) {
      if (err) {
        return res.sendStatus(500).end();
      } else {
        return res.json(data);
      }
    });
  });
  app.post('/data/page/', expressJwt({
    secret: secret
  }), function(req, res) {
    var newPage;
    newPage = new Page({
      title: req.body.title,
      author: req.body.author,
      route: utils.slugify(req.body.title),
      body: markdown.toHTML(req.body.body),
      content: req.body.body,
      creationDate: new Date(),
      updateDate: null,
      published: req.body.published
    });
    return newPage.save(function(err, data) {
      if (err) {
        return res.sendStatus(500).end();
      } else {
        return res.sendStatus(200).end();
      }
    });
  });
  app.put('/data/page/:route.json', expressJwt({
    secret: secret
  }), function(req, res) {
    var data;
    data = req.body;
    data.route = utils.slugify(data.title);
    data.body = markdown.toHTML(data.content);
    return Page.findOneAndUpdate({
      route: req.params.route
    }, data, {
      "new": true
    }, function(err, data) {
      if (err) {
        return res.sendStatus(500).end();
      } else if (data === undefined) {
        return res.sendStatus(404).end();
      } else {
        return res.sendStatus(200).end();
      }
    });
  });
  app["delete"]('/data/page/:route.json', expressJwt({
    secret: secret
  }), function(req, res) {
    return Page.remove({
      route: req.params.route
    }, function(err, data) {
      if (err) {
        return res.sendStatus(500).end();
      } else if (data.length < 1) {
        return res.sendStatus(404).end();
      } else {
        return res.sendStatus(200).end();
      }
    });
  });
  app.get('/data/files.json', expressJwt({
    secret: secret
  }), function(req, res) {
    return File.find({}, 'id path', function(err, data) {
      if (err) {
        return res.sendStatus(500).end();
      } else {
        return res.json(data);
      }
    });
  });
  app.post('/data/files', function(req, res) {
    req.pipe(req.busboy);
    return req.busboy.on("file", function(fieldname, file, filename) {
      var fstream;
      console.log("Uploading: " + filename);
      fstream = fs.createWriteStream(("" + __dirname + "/../../client/public/media/") + filename);
      file.pipe(fstream);
      return fstream.on("close", function() {
        file = File({
          id: filename,
          path: filename
        });
        file.save();
        return res.redirect('/admin/files');
      });
    });
  });
  app["delete"]('/data/files/:id', expressJwt({
    secret: secret
  }), function(req, res) {
    console.log(req.params.id);
    return File.findOne({
      id: req.params.id
    }, function(err, data) {
      console.log(data);
      return fs.unlink(("" + __dirname + "/../../client/public/media/") + data.path, function(err) {
        if (err) {
          res.sendStatus(500).end();
        }
        return File.remove({
          id: req.params.id
        }, function(err, data) {
          if (err) {
            return res.sendStatus(500).end();
          } else {
            return res.sendStatus(200).end();
          }
        });
      });
    });
  });
  app.post('/signup', function(req, res, next) {
    console.log('POST signup');
    return passport.authenticate('signup', function(err, user, info) {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.sendStatus(409).end();
      }
      return req.logIn(user, function(err) {
        if (err) {
          return next(err);
        }
        return res.sendStatus(201).end();
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
        return res.sendStatus(401).end();
      }
      return req.logIn(user, function(err) {
        var profile, token;
        if (err) {
          return next(err);
        }
        profile = {
          username: user.username,
          email: user.email,
          firstname: user.firstname,
          lastname: user.lastname
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
      email: req.body.email
    }, function(err, user) {
      if (err) {
        return res.sendStatus(500).end();
      } else if (user.length < 1) {
        return res.sendStatus(404).end();
      } else {
        return crypto.randomBytes(30, function(err, buf) {
          var mailOptions, token, ts;
          ts = (new Date()).getTime();
          token = buf.toString('hex');
          smtpTransport = null;
          if (smtp.service === 'smtp') {
            smtpTransport = nodemailer.createTransport(smtpTransport({
              host: smtp.host,
              port: smtp.port,
              secure: smtp.ssl,
              auth: {
                user: smtp.account,
                pass: smtp.password
              }
            }));
          } else {
            smtpTransport = nodemailer.createTransport({
              service: smtp.service,
              auth: {
                user: smtp.account,
                pass: smtp.password
              }
            });
          }
          mailOptions = {
            to: user.email,
            from: user.email,
            subject: 'Fluid Password Reset',
            text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' + 'Please click on the following link, or paste this into your browser to complete the process:\n\n' + 'http://' + req.headers.host + '/reset/' + token + '\n\n' + 'If you did not request this, please ignore this email and your password will remain unchanged.\n'
          };
          return smtpTransport.sendMail(mailOptions, function(err) {
            if (!err) {
              resetTokens[token] = {
                username: user.username,
                email: user.email,
                expirationDate: ts + (24 * 60 * 60 * 100)
              };
              return res.sendStatus(200).end();
            } else {
              console.log(err);
              return res.sendStatus(500).end();
            }
          });
        });
      }
    });
  });
  app.post('/reset', function(req, res, next) {
    var token;
    token = req.body.token;
    if (resetTokens[token].expirationDate < (new Date()).getTime()) {
      return res.sendStatus(498).end();
    }
    req.body.username = resetTokens[token].username;
    return passport.authenticate('reset', function(err, user, info) {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.sendStatus(401).end();
      }
      return req.logIn(user, function(err) {
        var profile;
        if (err) {
          return next(err);
        }
        profile = {
          username: user.username,
          email: user.email
        };
        token = jwt.sign(profile, 'this is my secret for jwt', {
          expiresInMinutes: 60 * 5
        });
        delete resetTokens[token];
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
