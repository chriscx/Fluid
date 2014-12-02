path = require 'path'
expressJwt = require 'express-jwt'
jwt = require 'jsonwebtoken'
nodemailer = require 'nodemailer'
crypto = require 'crypto'
markdown = require('markdown').markdown
utils = require './utils'
User = require('./models/user').User
Page = require('./models/page').Page
Menu = require('./models/menu').Menu
Post = require('./models/blog').Post
Category = require('./models/category').Category

secret = 'this is my secret for jwt'

module.exports = (app, passport) ->

  app.get '/data/user/:user.json', expressJwt({secret: secret}), (req, res) ->
    console.log('GET user \'' + req.user.username + '\' JSON object')
    User.findOne {username: req.user.username}, '-_id -__v', (err, data) ->
      delete data.password
      if err
       res.send(500).end()
      else if data is `undefined`
       res.send(404).end()
      else
        res.json data

  app.put '/data/user/:user.json', expressJwt({secret: secret}), (req, res) ->
    console.log('PUT user \'' + req.user.username + '\' JSON object')
    User.findOneAndUpdate username: req.user.username,
      req.body,
      new: true,
        (err, data) ->
          if err
           res.send(500).end()
          else if data is `undefined`
           res.send(404).end()
          else
            res.send(200).end()

  app.delete '/data/user/:user.json', expressJwt({secret: secret}), (req, res) ->
    console.log('DEL user \'' + req.user.username + '\' JSON object')
    User.remove {'username': req.user.username}, (err, data) ->
      if err
       res.send(500).end()
      else if data.length < 1
       res.send(404).end()
      else
        res.send(200).end()

  app.get '/data/blog/posts.json', expressJwt({secret: secret}), (req, res) ->
    console.log('GET playlist list of \'' + req.user.username + '\' JSON object')
    Post.find {author: req.user.username}, 'id title category', (err, data) ->
      console.log data
      unless err
        res.json data
      else
       res.send(404).end()

  app.get '/data/blog/post/:s/:l/posts.json', expressJwt secret: secret, (req, res) ->
    Post.find {}, '-_id -__v', {'skip': req.params.s, 'limit': req.params.l}
      .sort
        creationDate: 'desc'
      .exec (err, data) ->
        if err
         res.send(500).end()
        else
          res.json data

  app.get '/data/blog/post/:id.json', (req, res) ->
    Post.findOne {'id': req.params.id}, '-_id -__v', (err, data) ->
      if err
       res.send(500).end()
      else
        res.json data

  app.get '/data/blog/post/render/:route.json', (req, res) ->
    Post.findOne {'id': req.params.id}, '-_id -__v', (err, data) ->
      if err
       res.send(500).end()
      else
        data.body = markdown.toHTML data.body
        res.json data

  app.post '/data/blog/post/', expressJwt({secret: secret}), (req, res) ->

    console.log req.body

    newPost = new Post(
      title: req.body.title
      author: req.body.author
      id: utils.slugify req.body.title
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
        console.log err
        res.send(500).end()
      else
        res.send(200).end()

  app.put '/data/blog/post/:id.json', expressJwt({secret: secret}), (req, res) ->
    data = req.body
    data.id = utils.slugify data.title
    Post.findOneAndUpdate 'id': req.params.id,
      data,
      new: true,
        (err, data) ->
          if err
           res.send(500).end()
          else if data is `undefined`
           res.send(404).end()
          else
            res.end(200).end()

  app.delete '/data/blog/post/:id.json', expressJwt({secret: secret}), (req, res) ->
    Post.remove 'id': req.params.id, (err, data) ->
      if err
       res.send(500).end()
      else if data.length < 1
       res.send(404).end()
      else
        res.send(200).end()

  app.get '/data/blog/tag/:name/posts.json', (req, res) ->
    Post.find {'tags.name': req.params.name}, '-_id -__v', (err, data) ->
      if err
       res.send(500).end()
      else
        res.json data

  app.get '/data/blog/category/:name/posts.json', (req, res) ->
    Post.find {'category': req.params.name}, '-_id -__v', (err, data) ->
      if err
       res.send(500).end()
      else
        res.json data

  app.get '/data/blog/categories.json', (req, res) ->
    Category.find {}, '-_id -__v', (err, data) ->
      if err
       res.send(500).end()
      else
        res.json data

  app.get '/data/blog/category/:id.json', (req, res) ->
    Category.findOne {id: req.params.id}, '-_id -__v', (err, data) ->
      if err
       res.send(500).end()
      else if data is `undefined`
       res.send(404).end()
      else
        res.json data

  app.post '/data/blog/category/', expressJwt({secret: secret}), (req, res) ->
    newCategory = new Category(
      id: utils.slugify req.body.name
      name: req.body.name,
      description: req.body.description
    )

    newCategory.save (err) ->
      if err
       res.send(500).end()
      else
        res.send(200).end()

  app.put '/data/blog/category/:id.json', expressJwt({secret: secret}), (req, res) ->
    data = req.body
    data.id = utils.slugify data.name
    Category.findOneAndUpdate {id: req.params.id},
      data,
      new: true,
        (err, data) ->
          if err
           res.send(500).end()
          else if data is `undefined`
           res.send(404).end()
          else
            res.send(200).end()

  app.delete '/data/blog/category/:id.json', expressJwt({secret: secret}), (req, res) ->
    Category.remove {id: req.params.id}, (err, data) ->
      if err
       res.send(500).end()
      else if data.length < 1
       res.send(404).end()
      else
        res.send(200).end()

  app.get '/data/menu.json', (req, res) ->
    Menu.find {}, '-_id -__v', (err, data) ->
      if err
       res.send(500).end()
      else
        res.json data

  app.get '/data/menu/:id.json', (req, res) ->
    Menu.findOne {id: req.params.id}, '-_id -__v', (err, data) ->
      if err
       res.send(500).end()
      else
        res.json data

  app.post '/data/menu/', (req, res) ->
    # if route is updated, the menu link will be void
    newMenu = new Menu(
      id: utils.slugify req.body.name
      name: req.body.name
      route: req.body.name
      description: req.body.description
    )

    newMenu.save (err) ->
      if err
       res.send(500).end()
      else
        res.send(200).end()

  app.put '/data/menu/:id.json', (req, res) ->
    Menu.findOneAndUpdate {id: req.params.id},
    req.body,
    new: true,
      (err, data) ->
        if err
         res.send(500).end()
        else
          res.send(200).end()

  app.delete '/data/menu/:id.json', (req, res) ->
    Menu.remove {id: req.params.id}, (err, data) ->
      if err
       res.send(500).end()
      else if data.length < 1
       res.send(404).end()
      else
        res.send(200).end()

  app.get '/data/pages.json', (req, res) ->
    Page.find {}, 'route title', (err, data) ->
      if err
       res.send(500).end()
      else
        res.json data

  app.get '/data/page/:route.json', (req, res) ->
    Page.findOne {route: req.params.route}, '-_id -__v', (err, data) ->
      if err
       res.send(500).end()
      else
        res.json data

  app.get '/data/page/render/:route.json', (req, res) ->
    Page.findOne {route: req.params.route}, '-_id -__v', (err, data) ->
      if err
       res.send(500).end()
      else
        data.body = markdown.toHTML data.body
        res.json data

  app.post '/data/page/', expressJwt({secret: secret}), (req, res) ->
    newPage = new Page(
      title: req.body.title
      author: req.body.author
      route: utils.slugify req.body.title
      body: req.body.body
      creationDate: new Date()
      updateDate: null
      published: req.body.published
    )
    newPage.save (err, data) ->
      if err
       res.send(500).end()
      else
        res.send(200).end()

  app.put '/data/page/:route.json', expressJwt({secret: secret}), (req, res) ->
    data = req.body
    data.route = utils.slugify data.title
    Page.findOneAndUpdate route: req.params.route,
    data,
    new: true,
      (err, data) ->
        if err
         res.send(500).end()
        else if data is `undefined`
         res.send(404).end()
        else
          res.send(200).end()

  app.delete '/data/page/:route.json', expressJwt({secret: secret}), (req, res) ->
    Page.remove {route: req.params.route}, (err, data) ->
      if err
       res.send(500).end()
      else if data.length < 1
       res.send(404).end()
      else
        res.send(200).end()

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
        profile = username: user.username, email: user.email, firstname: user.firstname, lastname: user.lastname
        token = jwt.sign(profile, 'this is my secret for jwt', { expiresInMinutes: 60*5 })
        res.json token: token, user: profile
    ) req, res, next

  app.post '/forgot', (req, res, next) ->
    User.findOne username: req.user.username, (err, user) ->
      if err
       res.send(500).end()
      else if user.length < 1
       res.send(404).end()
      else
        crypto.randomBytes 20, (err, buf) ->
        token = buf.toString("hex")
        smtpTransport = nodemailer.createTransport()
        mailOptions =
          to: user.email
          from: 'passwordreset@demo.com'
          subject: 'Fluid Password Reset'
          text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' + 'Please click on the following link, or paste this into your browser to complete the process:\n\n' + 'http://' + req.headers.host + '/reset/' + token + '\n\n' + 'If you did not request this, please ignore this email and your password will remain unchanged.\n'

        smtpTransport.sendMail mailOptions, (err) ->
          unless err
            res.send(200).end()
          else
            res.send(500).end()

  app.post '/reset', (req, res, next) ->
    console.log('POST reset')
    passport.authenticate('reset', (err, user, info) ->
      return next(err) if err
      return res.send(401).end() unless user
      req.logIn user, (err) ->
        return next(err) if err
        console.log 'user' + user
        profile = username: user.username, email: user.email, firstname: user.firstname, lastname: user.lastname
        console.log 'profile:'
        console.log profile
        token = jwt.sign(profile, 'this is my secret for jwt', { expiresInMinutes: 60*5 })
        res.json token: token, user: profile
    ) req, res, next

  app.get '*', (req, res) ->
    console.log 'GET ' +  req.originalUrl + ' redirect to ' + '/#' + req.originalUrl
    res.redirect '/#' + req.originalUrl
