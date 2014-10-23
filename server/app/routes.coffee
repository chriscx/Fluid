path = require 'path'
expressJwt = require 'express-jwt'
jwt = require 'jsonwebtoken'
User = require('./models/user').User
Page = require('./models/page').Page
Menu = require('./models/menu').Menu
Post = require('./models/blog').Post
Category = require('./models/category').Category

module.exports = (app, passport) ->

  app.get '/data/user/:user.json', (req, res) ->
    console.log('GET user \'' + req.user.username + '\' JSON object')
    User.find {username: req.user.username}, (err, data) ->
      delete data.password
      if err
       res.send(500).end()
      else if data.length < 1
       res.send(404).end()
      else
        res.json data

  app.put '/data/user/:user.json', (req, res) ->
    console.log('PUT user \'' + req.user.username + '\' JSON object')
    User.findOneAndUpdate username: req.user.username,
      req.body,
      new: true,
        (err, data) ->
          if err
           res.send(500).end()
          else if data.length < 1
           res.send(404).end()
          else
            res.send(200).end()

  app.delete '/data/user/:user.json', (req, res) ->
    console.log('DEL user \'' + req.user.username + '\' JSON object')
    User.remove {'username': req.user.username}, (err, data) ->
      if err
       res.send(500).end()
      else if data.length < 1
       res.send(404).end()
      else
        res.send(200).end()

  app.get '/data/blog/posts/:s/:l/posts.json', (req, res) ->
    # check params for negative value or if non numerical values
    Post.find {}, null, {'skip': req.params.s, 'limit': req.params.l}
      .sort
        creationDate: 'desc'
      .exec (err, data) ->
        if err
         res.send(500).end()
        else if data.length < 1
         res.send(404).end()
        else
          res.json data

  app.get '/data/blog/post/:slug.json', (req, res) ->
    Post.find {'slug': req.params.slug}, (err, data) ->
      if err
       res.send(500).end()
      else if data.length < 1
       res.send(404).end()
      else
        res.json data

  app.post '/data/blog/post/:slug.json', (req, res) ->
    newPost = new Post(
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
      if err
       res.send(500).end()
      else if data.length < 1
       res.send(404).end()
      else
        res.send(200).end()

  app.put '/data/blog/post/:slug.json', (req, res) ->
    console.log 'update -> '
    console.log req.body
    Post.findOneAndUpdate 'slug': req.params.slug,
      req.body,
      new: true,
        (err, data) ->
          if err
           res.send(500).end()
          else if data.length < 1
           res.send(404).end()
          else
            res.end(200).end()

  app.delete '/data/blog/post/:slug.json', (req, res) ->
    Post.remove 'slug': req.params.slug, (err, data) ->
      if err
       res.send(500).end()
      else if data.length < 1
       res.send(404).end()
      else
        res.send(200).end()

  app.get '/data/blog/tag/:name/posts.json', (req, res) ->
    Post.find {'tags.name': req.params.name}, (err, data) ->
      if err
       res.send(500).end()
      else if data.length < 1
       res.send(404).end()
      else
        res.json data

  app.get '/data/blog/category/:name/posts.json', (req, res) ->
    Post.find {'category': req.params.name}, (err, data) ->
      if err
       res.send(500).end()
      else if data.length < 1
       res.send(404).end()
      else
        res.json data

  app.get '/data/blog/categories.json', (req, res) ->
    Category.find {}, (err, data) ->
      if err
       res.send(500).end()
      else if data.length < 1
       res.send(404).end()
      else
        res.json data

  app.get '/data/blog/category/:name.json', (req, res) ->
    Category.find {name: req.params.name}, (err, data) ->
      if err
       res.send(500).end()
      else if data.length < 1
       res.send(404).end()
      else
        res.json data

  app.post '/data/blog/category/:name.json', (req, res) ->
    newCategory = new Category(
      name: req.body.name,
      description: req.body.description
    )

    newCategory.save (err) ->
      if err
       res.send(500).end()
      else if data.length < 1
       res.send(404).end()
      else
        res.send(200).end()

  app.put '/data/blog/category/:name.json', (req, res) ->
    Category.findOneAndUpdate 'name': req.params.name,
      req.body,
      new: true,
        (err, data) ->
          if err
           res.send(500).end()
          else if data.length < 1
           res.send(404).end()
          else
            res.send(200).end()

  app.delete '/data/blog/category/:name.json', (req, res) ->
    Category.remove 'name': req.params.name, (err, data) ->
      if err
       res.send(500).end()
      else if data.length < 1
       res.send(404).end()
      else
        res.send(200).end()

  app.get '/menu.json', (req, res) ->
    Menu.find {}, (err, data) ->
      if err
       res.send(500).end()
      else if data.length < 1
       res.send(404).end()
      else
        res.json data

  app.get '/data/page/:route.json', (req, res) ->
    Page.find {route: req.params.route}, (err, data) ->
      if err
       res.send(500).end()
      else if data.length < 1
       res.send(404).end()
      else
        res.json data

  app.post '/data/page/:route.json', (req, res) ->
    newPage = new Page(
      title: req.body.title
      author: req.body.author
      route: req.params.route
      body: req.body.body
      creationDate: new Date()
      updateDate: null
      published: req.body.published
    )
    newPage.create (err, data) ->
      if err
       res.send(500).end()
      else if data.length < 1
       res.send(404).end()
      else
        res.send(200).end()

  app.put '/data/page/:route.json', (req, res) ->
    console.log 'update -> '
    console.log req.body
    Page.findOneAndUpdate route: req.params.route,
    req.body,
    new: true,
      (err, data) ->
        if err
         res.send(500).end()
        else if data.length < 1
         res.send(404).end()
        else
          res.send(200).end()

  app.delete '/data/page/:route.json', (req, res) ->
    Page.remove {route: req.params.route}, (err, data) ->
      if err
       res.send(500).end()
      else if data.length < 1
       res.send(404).end()
      else
        res.send(200).end()

  app.get '/data/pages.json', (req, res) ->
    Page.find {}, (err, data) ->
      if err
       res.send(500).end()
      else if data.length < 1
       res.send(404).end()
      else
        res.json data

  app.post '/signup', (req, res, next) ->
    console.log('POST signup')
    passport.authenticate('signup', (err, user, info) ->
      return next(err) if err
      return res.send(409).end() unless user
      req.logIn user, (err) ->
        return next(err) if err
        res.send(201).end()
    ) req, res, next

  app.post '/login', (req, res, next) ->
    console.log('POST login')
    passport.authenticate('login', (err, user, info) ->
      return next(err) if err
      return res.send(401).end() unless user
      req.logIn user, (err) ->
        return next(err) if err
        console.log 'user' + user
        profile = username: user.username, firstname: user.firstname, lastname:user.lastname, country: user.country
        token = jwt.sign(profile, 'this is my secret for jwt', { expiresInMinutes: 60*5 })
        res.json token: token, user: profile
    ) req, res, next

  app.get '*', (req, res) ->
    console.log 'GET ' +  req.originalUrl + ' redirect to ' + '/#' + req.originalUrl
    res.redirect '/#' + req.originalUrl
