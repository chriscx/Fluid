config = require '../config'
sha1 = require 'sha1'
eventEmitter = require('events').EventEmitter
passport = require 'passport'

Entry = require('../models/blog').Entry
Category = require('../models/category').Category
Account = require('../models/account').Account
Page = require('../models/page').Page

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
    app.get '/blog/post/:slug.json', (req, res) ->
      Entry.find {"slug": req.params.slug}, (err, data) ->
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
    app.post '/blog/post/:slug.json', (req, res) ->
      newPost = new Entry(
        title: req.body.title
        author: req.body.author
        slug: req.params.slug
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
    app.put '/blog/post/:slug.json', (req, res) ->
      console.log 'update -> '
      console.log req.body
      Entry.findOneAndUpdate 'slug': req.params.slug,
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
    app.del '/blog/post/:slug.json', (req, res) ->
      Entry.remove 'slug': req.params.slug, (err, data) ->
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
    app.get '/blog/category/:name/posts.json', (req, res) ->
      Entry.find {'category': req.params.name}, (err, data) ->
        if err
          res.json result: 'error'
        else
          res.json
            result: 'OK'
            entries: data

    #
    #     `Get Categories`
    #    ----------------------------
    #
    app.get '/blog/categories.json', (req, res) ->
      Category.find {}, (err, data) ->
        if err
          res.json result: 'error'
        else
          res.json
            result: 'OK'
            categories: data

    #
    #     `Get Category`
    #    ----------------------------
    #
    app.get '/blog/category/:name.json', (req, res) ->
      Category.find {name: req.params.name}, (err, data) ->
        if err
          res.json result: 'error'
        else
          res.json
            result: 'OK'
            category: data

    #
    #     `Post Category`
    #    ----------------------------
    #
    app.post '/blog/category/:name.json', (req, res) ->
      newCategory = new Category(
        name: req.body.name,
        description: req.body.description
      )

      newCategory.save (err) ->
        unless err
          res.json result: 'OK'
        else
          res.json
            result: 'error'
            err: err

    #
    #     `Put category`
    #    ----------------------------
    #
    app.put '/blog/category/:name.json', (req, res) ->
      Category.findOneAndUpdate 'name': req.params.name,
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
    #     `Del category`
    #    ----------------------------
    #
    app.del '/blog/category/:name.json', (req, res) ->
      Category.remove 'name': req.params.name, (err, data) ->
        if data > 0 and not err
          res.json result: 'OK'
        else
          res.json
            result: 'error'
            err: err

  login: (app) ->

    #
    #     `Get signup page`
    #    ----------------------------
    #
    app.get '/signup', (req, res) ->
      res.render 'signup',
        title: 'Fluid'

    #
    #     `Post signup page`
    #    ----------------------------
    #
    app.post '/signup', (req, res) ->
      Account.register new Account(username: req.body.username), req.body.password, (err, Account) ->
        if err
          res.render 'signup',
            info: 'Sorry. That username already exists. Try again.'

        passport.authenticate 'local', (req, res) ->
          res.redirect '/'

    #
    #     `Get login page`
    #    ----------------------------
    #
    app.get '/login', (req, res) ->
      res.render 'login',
        title: 'Disko'
        user: req.user

    #
    #     `Get login page`
    #    ----------------------------
    #
    app.post '/login', passport.authenticate 'local', (req, res) ->
      res.redirect '/'

    #
    #     `Get logout page`
    #    ----------------------------
    #
    app.get '/logout', (req, res) ->
      req.logout()
      res.redirect '/'

  error: (app) ->

    #
    #     `error redirection page`
   	#	  specify error number as parameter
    #    ----------------------------
    #
    app.get '/error/:error', (req, res) ->
      res.render 'error'

  site: (app) ->

    #
    #     `Get index page`
    #    ----------------------------
    #
    app.get '/', (req, res) ->
      res.render 'index'

    #
    #     `Get admin page`
    #    ----------------------------
    #
    app.get '/admin', (req, res) ->
      res.render 'admin'

    #
    #     `Get page (json)`
    #    ----------------------------
    #
    app.get '/page/:route.json', (req, res) ->
      Page.find {route: req.params.route}, (err, data) ->
        if err
          res.json result: 'error'
        else
          res.json
            result: 'OK'
            page: data

    #
    #     `Post page (json)`
    #    ----------------------------
    #
    app.post '/page/:route.json', (req, res) ->
      newPage = new Page(
        title: req.body.title
        author: req.body.author
        route: req.params.route
        body: req.body.body
        creationDate: new Date()
        updateDate: null
        published: req.body.published
      )
      newPage.save (err) ->
        unless err
          res.json result: 'OK'
        else
          res.json
            result: 'error'
            err: err

    #
    #     `Put page (json)`
    #    ----------------------------
    #
    app.put '/page/:route.json', (req, res) ->
      console.log 'update -> '
      console.log req.body
      Page.findOneAndUpdate route: req.params.route,
      req.body,
      new: true,
        (err, data) ->
          if err
            res.json result: 'error'
          else
            res.json
              result: 'OK'
              page: data

    #
    #     `Del page (json)`
    #    ----------------------------
    #
    app.del '/page/:route.json', (req, res) ->
      Page.remove {route: req.params.route}, (err, data) ->
        if data > 0 and not err
          res.json result: 'OK'
        else
          res.json
            result: 'error'
            err: err

    #
    #     `Get all pages (json)`
    #    ----------------------------
    #
    app.get '/pages.json', (req, res) ->
      Page.find {}, (err, data) ->
        if err
          res.json result: 'error'
        else
          res.json
            result: 'OK'
            pages: data

    #
    #     `Get page by route defined by user`
    #	  Note: need to be called last because it
   	#	        would overwrite all other routes
    #    ----------------------------
    #
    app.get '/:route', (req, res) ->
      Page.find {route: req.params.route}, (err, data) ->
        if err
          res.redirect '/error/501'
        else if data.length = 0
          res.redirect '/error/404'
        else
          res.render 'page'
