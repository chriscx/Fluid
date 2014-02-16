var user, blog, config, sha1, eventEmitter;

user = require('../lib/user');
blog = require('../lib/blog');
config = require('../config');
sha1 = require('sha1');
eventEmitter = require('events').EventEmitter;


checkAuth = function(req, res, next) {
  var actualTimestamp;
  actualTimestamp = (new Date()).getTime();
  if (!(req.session.logged_in === true && actualTimestamp < req.session.expirationDate)) {
    return res.redirect("/login");
  } else {
    return next();
  }
};

module.exports = {

  blog: function(app) {
    /*
     `Get blog page`
    ----------------------------
    */

    app.get("/blog", function(req, res) {

      var check = 0, categories, tags, entries, eventflow = new eventEmitter();

      blog.getCategories(function(err, cat) {
        categories = cat;
        check++;
        if(check === 3)
          eventflow.emit('render');
      });
      blog.getEntries(5, 0, function(err, ent) {
        entries = ent;
        check++;
        if(check === 3)
          eventflow.emit('render');
      });
      blog.getTags(function(err, tag) {
        tags = tag;
        check++;
        if(check === 3)
          eventflow.emit('render');
      });

      eventflow.on('render', function() {
        console.log(categories);
        console.log(tags);
        console.log(entries);
        console.log(config);
        return res.render('blog', {
                  entries: entries,
                  categories: categories,
                  tags: tags,
                  config: config,
                  request: req
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

      var check = 0, categories, tags, entry, eventflow = new eventEmitter();

      blog.getCategories(function(err, cat) {
        categories = cat;
        check++;
        if(check === 3)
          eventflow.emit('render');
      });
      blog.getEntry({title: req.params.uri}, function(err, ent) {
        entry = ent;
        check++;
        if(check === 3)
          eventflow.emit('render');
      });
      blog.getTags(function(err, tag) {
        tags = tag;
        check++;
        if(check === 3)
          eventflow.emit('render');
      });

      eventflow.on('render', function() {
        console.log(categories);
        console.log(tags);
        console.log(entry);
        console.log(config);
        return res.render('post', {
                  entry: entry,
                  categories: categories,
                  tags: tags,
                  config: config,
                  request: req
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

      var check = 0, categories, tags, entries, eventflow = new eventEmitter();

      blog.getCategories(function(err, cat) {
        categories = cat;
        check++;
        if(check === 3)
          eventflow.emit('render');
      });
      blog.getEntry({"tags.name": req.params.name}, function(err, ent) {
        entries = ent;
        check++;
        if(check === 3)
          eventflow.emit('render');
      });
      blog.getTags(function(err, tag) {
        tags = tag;
        check++;
        if(check === 3)
          eventflow.emit('render');
      });

      eventflow.on('render', function() {
        console.log(categories);
        console.log(tags);
        console.log(entries);
        console.log(config);
        return res.render('blog', {
                  entries: entries,
                  categories: categories,
                  tags: tags,
                  config: config,
                  request: req
                });
      });
    });

    /*
     `Get posts by category`
    ----------------------------
    */

    app.get("/blog/category/:name", function(req, res) {

      var check = 0, categories, tags, entries, eventflow = new eventEmitter();

      blog.getCategories(function(err, cat) {
        categories = cat;
        check++;
        if(check === 3)
          eventflow.emit('render');
      });
      blog.getEntry({category: req.params.name}, function(err, ent) {
        entries = ent;
        check++;
        if(check === 3)
          eventflow.emit('render');
      });
      blog.getTags(function(err, tag) {
        tags = tag;
        check++;
        if(check === 3)
          eventflow.emit('render');
      });

      eventflow.on('render', function() {
        console.log(categories);
        console.log(tags);
        console.log(entries);
        console.log(config);
        return res.render('blog', {
                  entries: entries,
                  categories: categories,
                  tags: tags,
                  config: config,
                  request: req
                });
      });
    });
  },

  site: function(app) {

    /*
    `Get index page`
    ----------------------------
    */

    console.log(config.routes);
    for(var i in config.routes) {
      app.get(config.routes[i].path, function(req, res) {
        return res.render(config.routes[i].view, {
          title: config.title,
          config: config,
          request: req
        });
      });
    }
  },

  login: function(app) {
    /*
     `Get admin page`
    ----------------------------
    */

    app.get("/admin", function(req, res) {
      return res.render('admin', {
        title: 'Fluid Admin',
        config: config,
        request: req
      });
    });

    /*
     `Get login page`
    ----------------------------
    */

    app.get("/login", function(req, res) {
      return res.render('login', {
        title: 'Fluid',
        config: config,
        request: req
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
     `Logout page`
    ----------------------------
    */

    app.get("/logout", checkAuth, function(req, res) {
      delete req.session.logged_in;
      return res.redirect("/login");
    });

  },

  error: function(app) {

    /*
     `error redirection page`
    ----------------------------
    */
    app.get("/error/:error", function(req, res) {
      return res.render('error', {
        error: req.param.error,
        config: config,
        request: req
      });
    });
  }
}
