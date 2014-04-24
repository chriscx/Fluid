user = require("../lib/user")
blog = require("../lib/blog")
config = require("../config")
sha1 = require("sha1")
eventEmitter = require("events").EventEmitter
checkAuth = (req, res, next) ->
  actualTimestamp = undefined
  actualTimestamp = (new Date()).getTime()
  unless req.session.logged_in is true and actualTimestamp < req.session.expirationDate
    res.redirect "/login"
  else
    next()

module.exports =
  blog: (app) ->
    
    #
    #     `Get blog page`
    #    ----------------------------
    #    
    app.get "/blog", (req, res) ->
      check = 0
      categories = undefined
      tags = undefined
      entries = undefined
      eventflow = new eventEmitter()
      blog.getCategories (err, cat) ->
        categories = cat
        check++
        eventflow.emit "render"  if check is 3

      blog.getEntries 5, 0, (err, ent) ->
        entries = ent
        check++
        eventflow.emit "render"  if check is 3

      blog.getTags (err, tag) ->
        tags = tag
        check++
        eventflow.emit "render"  if check is 3

      eventflow.on "render", ->
        res.render "blog",
          entries: entries
          categories: categories
          tags: tags
          config: config
          request: req

    #
    #     `Get pagination blog posts`
    #    ----------------------------
    #    
    app.get "/blog/posts/:l/:s", (req, res) ->
      blog.getEntries req.params.l, req.params.s, (err, entries) ->
        if err
          res.json error: 404
        else
          res.json
            result: "OK"
            entries: entries
    
    #
    #     `get specific blog post`
    #    ----------------------------
    #    
    app.get "/blog/post/:uri", (req, res) ->
      check = 0
      categories = undefined
      tags = undefined
      entry = undefined
      eventflow = new eventEmitter()
      blog.getCategories (err, cat) ->
        categories = cat
        check++
        eventflow.emit "render"  if check is 3

      blog.getEntry
        title: req.params.uri
      , (err, ent) ->
        entry = ent
        check++
        eventflow.emit "render"  if check is 3

      blog.getTags (err, tag) ->
        tags = tag
        check++
        eventflow.emit "render"  if check is 3

      eventflow.on "render", ->
        res.render "post",
          entry: entry
          categories: categories
          tags: tags
          config: config
          request: req
    
    #
    #     `Post create blog post`
    #    ----------------------------
    #    
    app.post "/blog/post/create", checkAuth, (req, res) ->
      entry =
        title: req.body.title
        author: req.session.userId
        url: encodeURI(req.body.title.toLowerCase())
        body: ""
        tags: []
        category: null
        comments: []
        creationDate: new Date()
        updateDate: null
        published: true

      blog.createEntry entry, (err, data) ->
        if err
          res.json
            result: "error"
            error: err

        res.json
          result: "OK"
          newEntry: data
    
    #
    #     `Update blog post`
    #    ----------------------------
    #    
    app.put "/blog/post/:id", checkAuth, (req, res) ->
      blog.editEntry req.params.id, req.body, (err, data) ->
        unless err
          res.json result: "OK"
        else
          res.json
            result: "error"
            err: err

    #
    #     `Delete blog post`
    #    ----------------------------
    #    
    app.del "/blog/post/:id", checkAuth, (req, res) ->
      blog.removeEntry req.params.id, (err, data) ->
        if data > 0 and not err
          res.json result: "OK"
        else
          res.json
            result: "error"
            err: err
    
    #
    #     `Get posts by tags`
    #    ----------------------------
    #    
    app.get "/blog/tag/:name", (req, res) ->
      check = 0
      categories = undefined
      tags = undefined
      entries = undefined
      eventflow = new eventEmitter()
      blog.getCategories (err, cat) ->
        categories = cat
        check++
        eventflow.emit "render"  if check is 3

      blog.getEntry
        "tags.name": req.params.name
      , (err, ent) ->
        entries = ent
        check++
        eventflow.emit "render"  if check is 3

      blog.getTags (err, tag) ->
        tags = tag
        check++
        eventflow.emit "render"  if check is 3

      eventflow.on "render", ->
        res.render "blog",
          entries: entries
          categories: categories
          tags: tags
          config: config
          request: req
    
    #
    #     `Get posts by category`
    #    ----------------------------
    #    
    app.get "/blog/category/:name", (req, res) ->
      check = 0
      categories = undefined
      tags = undefined
      entries = undefined
      eventflow = new eventEmitter()
      blog.getCategories (err, cat) ->
        categories = cat
        check++
        eventflow.emit "render"  if check is 3

      blog.getEntry
        category: req.params.name
      , (err, ent) ->
        entries = ent
        check++
        eventflow.emit "render"  if check is 3

      blog.getTags (err, tag) ->
        tags = tag
        check++
        eventflow.emit "render"  if check is 3

      eventflow.on "render", ->
        res.render "blog",
          entries: entries
          categories: categories
          tags: tags
          config: config
          request: req

  site: (app) ->
    
    #
    #    `Get index page`
    #    ----------------------------
    #    
    for i of config.routes
      app.get config.routes[i].path, (req, res) ->
        res.render config.routes[i].view,
          title: config.title
          config: config
          request: req

  login: (app) ->
    
    #
    #     `Get admin page`
    #    ----------------------------
    #    
    app.get "/admin", (req, res) ->
      check = 0
      categories = undefined
      tags = undefined
      entries = undefined
      eventflow = new eventEmitter()
      blog.getCategories (err, cat) ->
        categories = cat
        check++
        eventflow.emit "render"  if check is 3
        return

      blog.getEntries 5, 0, (err, ent) ->
        entries = ent
        check++
        eventflow.emit "render"  if check is 3
        return

      blog.getTags (err, tag) ->
        tags = tag
        check++
        eventflow.emit "render"  if check is 3
        return

      eventflow.on "render", ->
        res.render "admin",
          entries: entries
          categories: categories
          tags: tags
          config: config
          request: req
    
    #
    #     `Get login page`
    #    ----------------------------
    #    
    app.get "/login", (req, res) ->
      res.render "login",
        title: "Fluid"
        config: config
        request: req

    #
    #     `Post login`
    #    ----------------------------
    #    
    app.post "/login", (req, res, next) ->
      _data = undefined
      _data = null
      user.checkPassword req.body.login, sha1(req.body.password), (err, data) ->
        expirationTimestamp = undefined
        return next(err)  if err
        if data.check
          req.session.logged_in = true
          req.session.userId = data.userId
          expirationTimestamp = (new Date()).getTime()
          req.session.expirationDate = expirationTimestamp + 30 * 60 * 1000
          req.session.login = req.body.email
          res.redirect "/"
        else
          res.redirect "/login"

    #
    #     `Logout page`
    #    ----------------------------
    #    
    app.get "/logout", checkAuth, (req, res) ->
      delete req.session.logged_in

      res.redirect "/login"

  error: (app) ->
    
    #
    #     `error redirection page`
    #    ----------------------------
    #    
    app.get "/error/:error", (req, res) ->
      res.render "error",
        error: req.param.error
        config: config
        request: req