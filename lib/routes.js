var user, blog, config, sha1;

user = require('../lib/user');
blog = require('../lib/blog');
config = require('../lib/config');
sha1 = require('sha1');


checkAuth = function(req, res, next) {
  var actualTimestamp;
  actualTimestamp = (new Date()).getTime();
  if (!(req.session.logged_in === true && actualTimestamp < req.session.expirationDate)) {
    return res.redirect("/login");
  } else {
    return next();
  }
};

module.exports = function(app) {

  /*
  `Get index page`
  ----------------------------
  */

  app.get('/', function(req, res) {
    return config.getAll(function(err, config) {
      res.render('index', {
        title: 'Fluid',
        config: config
      });
    });
  });

  /*
   `Get admin page`
  ----------------------------
  */

  app.get("/admin", function(req, res) {
    return config.getAll(function(err, config) {
      res.render('admin', {
        title: 'Fluid Admin',
        config: config
      });
    });
  });

  /*
   `Get login page`
  ----------------------------
  */

  app.get("/login", function(req, res) {
    return config.getAll(function(err, config) {
      res.render('login', {
        title: 'Fluid',
        config: config
      });
    });
  });

  /*
   `Post login`
  ----------------------------
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
   `Get blog page`
  ----------------------------
  */

  app.get("/blog", function(req, res) {
    return config.getAll(function(err, config) {
      blog.getEntries(5, 0, function(err, entries) {
        if(err) {
          res.redirect('error/404');
        }
        else {
          res.render('blog', {
            entries: entries,
            config: config
          })
        }
      });
    });
  });

  /*
   `Get pagination blog posts`
  ----------------------------
  */

  app.get("/blog/posts/:l/:s", function(req, res) {
    return blog.getEntries(req.params.l, req.params.s, function(err, entries) {
      if(err) {
        res.json({
          error: 404
        });
      }
      else {
        res.json({
          result: 'OK',
          entries: entries
        });
      }
    });
  });

  /*
   `get specific blog post`
  ----------------------------
  */

  app.get("/blog/post/:uri", function(req, res) {

    return config.getAll(function(err, config) {

      blog.getEntry({title: req.params.uri}, function(err, data) {
        if(data.length > 0) {
          return res.render('post', {
            entry: data,
            config: config
          });
        }
        else {
          res.redirect('error/404');
        }
      });
    });
  });

  /*
   `Post create blog post`
  ----------------------------
  */

  app.post("/blog/post/create", function(req, res) {

    var entry = { 
      title: req.body.title,
      author: req.session.userId, 
      url: encodeURI(req.body.title.toLowerCase()),
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
        res.json({
          result: "error",
          error: err
        });
      }
      res.json({
        result: "OK",
        newEntry: data
      });
    });
  });

  /*
   `Update blog post`
  ----------------------------
  */

  app.put("/blog/post/:id", function(req, res) {

    return blog.editEntry(req.param.id, JSON.parse(req.body), function(err, data) {
      if(data.length > 0) {
        return res.json({
          result: 'OK'
        });
      }
      else {
        res.json({
          result: 'error',
          err: err
        });
      }
    });
  });

  /*
   `Delete blog post`
  ----------------------------
  */

  app.del("/blog/post/:id", function(req, res) {

    return blog.removeEntry(req.param.id, function(err, data) {
      if(data.length > 0) {
        return res.json({
          result: 'OK'
        });
      }
      else {
        res.json({
          result: 'error',
          err: err
        });
      }
    });
  });

  /*
   `Get posts by tags`
  ----------------------------
  */

  app.get("/blog/tag/:name", function(req, res) {

    return config.getAll(function(err, config) {

      blog.getEntry({"tags.name": "tag"}, function(err, entries) {
        if(err) {
          res.redirect('error/404');
        }
        else {
          res.render('blog', {
            entries: entries,
            config: config
          })
        }
      });
    });
  });

  /*
   `Get posts by category`
  ----------------------------
  */

  app.get("/blog/category/:name", function(req, res) {

    return config.getAll(function(err, config) {

      blog.getEntry({category: req.params.name}, function(err, entries) {
        if(err) {
          res.redirect('error/404');
        }
        else {
          res.render('blog', {
            entries: entries,
            config: config
          })
        }
      });
    });
  });

  /*
   `Logout page`
  ----------------------------
  */

  app.get("/logout", checkAuth, function(req, res) {
    delete req.session.logged_in;
    return res.redirect("/login");
  });

  /*
   `error redirection page`
  ----------------------------
  */

  app.get("/error/:error", function(req, res) {
    return config.getAll(function(err, config) {
      res.render('error', {
        error: req.param.error,
        config: config
      });
    });
  });
}