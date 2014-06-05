config = require '../config'
sha1 = require 'sha1'
eventEmitter = require('events').EventEmitter
passport = require 'passport'

Entry = require('../models/blog').Entry
EntrySchema = require('../models/blog').Schema

Category = require('../models/category').Category
CategorySchema = require('../models/category').Schema

Account = require('../models/account').Account
AccountSchema = require('../models/account').Schema

Page = require('../models/page').Page
PageSchema = require('../models/page').Schema

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
    app.get '/blog/posts/:s/:l/posts.json', (req, res) ->
      # check params for negative value or if non numerical values
      Entry.find {}, null, {'skip': req.params.s, 'limit': req.params.l}
        .sort
          creationDate: 'desc'
        .exec (err, data) ->
          if err
            res.json result: 'error'
          else
            res.json
              result: 'OK'
              entries: data

    #
    #     `get specific blog post`
    #    ----------------------------
    #
    app.get '/blog/post/:id.json', (req, res) ->
      Entry.find {"id": req.params.id}, (err, data) ->
        if err
          res.json
            result: 'error'
            type: '404'
        else
          res.json
            result: 'OK'
            entries: data

    #
    #     `Post create blog post`
    #    ----------------------------
    #
    app.post '/blog/post/:id.json', (req, res) ->
      newPost = new Entry(
        title: req.body.title
        author: req.body.author
        id: req.params.id
        body: req.body.body
        tags: req.body.tags
        Category: 'test'
        comments: []
        creationDate: new Date()
        updateDate: null
        published: req.body.published
      )
      newPost.save (err) ->
        unless err
          res.json result: 'OK'
        else
          res.json
            result: 'error'
            err: err

    #
    #     `Update blog post`
    #    ----------------------------
    #
    app.put '/blog/post/:id.json', (req, res) ->
      Entry.findOneAndUpdate 'id': req.params.id,
        req.body,
        new: true,
          (err, data) ->
            unless err
              res.json result: 'OK'
            else
              res.json
                result: 'error'
                err: err

    #
    #     `Delete blog post`
    #    ----------------------------
    #
    app.del '/blog/post/:id.json', (req, res) ->
      Entry.remove 'id': req.params.id, (err, data) ->
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
      Entry.find {'tags.name': req.params.name}, (err, data) ->
        if err
          res.json result: 'error'
        else
          res.json
            result: 'OK'
            entries: data

    #
    #     `Get posts by Category`
    #    ----------------------------
    #
    app.get '/blog/Category/:name/posts.json', (req, res) ->
      Entry.find {'category': req.params.name}, (err, data) ->
        if err
          res.json result: 'error'
        else
          res.json
            result: 'OK'
            entries: data


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

    app.get '/pages.json', (req, res) ->
      Page.find {}, (err, data) ->
        if err
          res.json result: 'error'
        else
          res.json
            result: 'OK'
            entries: data

  login: (app) ->

    app.get '/signup', (req, res) ->
      res.render 'signup',
        title: 'Disko'

    app.post '/signup', (req, res) ->
      Account.register new Account(username: req.body.username), req.body.password, (err, Account) ->
        if err
          res.render 'signup',
            info: 'Sorry. That username already exists. Try again.'

        passport.authenticate 'local', (req, res) ->
          res.redirect '/'

    app.get '/login', (req, res) ->
      res.render 'login',
        title: 'Disko'
        user: req.user

    app.post '/login', passport.authenticate 'local', (req, res) ->
      res.redirect '/'

    app.get '/logout', (req, res) ->
      req.logout()
      res.redirect '/'

  error: (app) ->

    #
    #     `error redirection page`
    #    ----------------------------
    #
    app.get '/error/:error', (req, res) ->
      res.render 'error'

    app.get '/admin', (req, res) ->
      res.render 'admin'
