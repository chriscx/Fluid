config = require '../config'
sha1 = require 'sha1'
eventEmitter = require('events').EventEmitter

entry = require('../models/blog').Entry
entrySchema = require('../models/blog').Schema

category = require('../models/category').Category
categorySchema = require('../models/category').Schema

account = require('../models/account').Account
accountSchema = require('../models/account').Schema

module.exports =
  blog: (app) ->

    #
    #     `Get blog page`
    #    ----------------------------
    #
    app.get '/blog', (req, res) ->
      res.render 'blog'

    #
    #     `Get pagination blog posts`
    #    ----------------------------
    #
    app.get '/blog/posts/:s-:e/posts.json', (req, res) ->
      # blog.getEntries req.params.l, req.params.s, (err, entries) ->
      #   if err
      #     res.json error: 404
      #   else
      #     res.json
      #       result: 'OK'
      #       entries: entries

    #
    #     `get specific blog post`
    #    ----------------------------
    #
    app.get '/blog/post/:id.json', (req, res) ->
      # res.render 'post'

    #
    #     `Post create blog post`
    #    ----------------------------
    #
    app.post '/blog/post/id.json', (req, res) ->
      # entry =
      #   title: req.body.title
      #   author: req.session.userId
      #   url: encodeURI(req.body.title.toLowerCase())
      #   body: ''
      #   tags: []
      #   category: null
      #   comments: []
      #   creationDate: new Date()
      #   updateDate: null
      #   published: true
      #
      # blog.createEntry entry, (err, data) ->
      #   if err
      #     res.json
      #       result: 'error'
      #       error: err
      #
      #   res.json
      #     result: 'OK'
      #     newEntry: data

    #
    #     `Update blog post`
    #    ----------------------------
    #
    app.put '/blog/post/:id.json', (req, res) ->
      # blog.editEntry req.params.id, req.body, (err, data) ->
      #   unless err
      #     res.json result: 'OK'
      #   else
      #     res.json
      #       result: 'error'
      #       err: err

    #
    #     `Delete blog post`
    #    ----------------------------
    #
    app.del '/blog/post/:id.json', (req, res) ->
      blog.removeEntry req.params.id, (err, data) ->
        if data > 0 and not err
          res.json result: 'OK'
        else
          res.json
            result: 'error'
            err: err

    #
    #     `Get posts by tags`
    #    ----------------------------
    #
    app.get '/blog/tag/:name/posts.json', (req, res) ->
      # res.render 'blog',


    #
    #     `Get posts by category`
    #    ----------------------------
    #
    app.get '/blog/category/:name.json', (req, res) ->
      # res.render 'blog',


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

    # app.get '/register', (req, res) ->
    #   res.render 'register',
    #     title: 'Disko'
    #     {}
    #
    # app.post '/register', (req, res) ->
    #   Account.register new Account(username: req.body.username), req.body.password, (err, account) ->
    #     if err
    #       res.render 'register',
    #         info: 'Sorry. That username already exists. Try again.'
    #
    #     passport.authenticate 'local', (req, res) ->
    #       res.redirect '/'
    #
    # app.get '/login', (req, res) ->
    #   res.render 'login',
    #     title: 'Disko'
    #     user: req.user
    #
    # app.post '/login', passport.authenticate 'local', (req, res) ->
    #   res.redirect '/'
    #
    # app.get '/logout', (req, res) ->
    #   req.logout()
    #   res.redirect '/'

  error: (app) ->

    #
    #     `error redirection page`
    #    ----------------------------
    #
    app.get '/error/:error', (req, res) ->
      res.render 'error'
