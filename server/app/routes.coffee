path = require 'path'
expressJwt = require 'express-jwt'
jwt = require 'jsonwebtoken'
nodemailer = require 'nodemailer'
crypto = require 'crypto'
utils = require './utils'
User = require('./models/user').User
Page = require('./models/page').Page
Menu = require('./models/menu').Menu
Post = require('./models/blog').Post
Category = require('./models/category').Category

module.exports = (app, passport) ->

  app.get '/data/user/:user.json', (req, res) ->
    console.log('GET user \'' + req.user.username + '\' JSON object')
    User.findOne {username: req.user.username}, '-_id -__v', (err, data) ->
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

  app.get '/data/blog/posts.json', (req, res) ->
    console.log('GET playlist list JSON object')
    Post.find {author: req.user.username}, 'id title category -_id -__v', (err, data) ->
        unless err
          res.json data
        else
         res.send(404).end()

  app.get '/data/blog/post/:s/:l/posts.json', (req, res) ->
    Post.find {}, '-_id -__v', {'skip': req.params.s, 'limit': req.params.l}
      .sort
        creationDate: 'desc'
      .exec (err, data) ->
        if err
         res.send(500).end()
        else if data.length < 1
         res.send(404).end()
        else
          res.json data

  app.get '/data/blog/post/:id.json', (req, res) ->
    Post.findOne {'id': req.params.id}, '-_id -__v', (err, data) ->
      if err
       res.send(500).end()
      else if data.length < 1
       res.send(404).end()
      else
        res.json data

  app.post '/data/blog/post/', (req, res) ->
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
       res.send(500).end()
      else if data.length < 1
       res.send(404).end()
      else
        res.send(200).end()

  app.put '/data/blog/post/:id.json', (req, res) ->
    console.log 'update -> '
    console.log req.body
    Post.findOneAndUpdate 'id': req.params.id,
      req.body,
      new: true,
        (err, data) ->
          if err
           res.send(500).end()
          else if data.length < 1
           res.send(404).end()
          else
            res.end(200).end()

  app.delete '/data/blog/post/:id.json', (req, res) ->
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
      else if data.length < 1
       res.send(404).end()
      else
        res.json data

  app.get '/data/blog/category/:name/posts.json', (req, res) ->
    Post.find {'category': req.params.name}, '-_id -__v', (err, data) ->
      if err
       res.send(500).end()
      else if data.length < 1
       res.send(404).end()
      else
        res.json data

  app.get '/data/blog/categories.json', (req, res) ->
    Category.find {}, '-_id -__v', (err, data) ->
      if err
       res.send(500).end()
      else if data.length < 1
       res.send(404).end()
      else
        res.json data

  app.get '/data/blog/category/:name.json', (req, res) ->
    Category.findOne {name: req.params.name}, '-_id -__v', (err, data) ->
      if err
       res.send(500).end()
      else if data.length < 1
       res.send(404).end()
      else
        res.json data

  app.post '/data/blog/category/', (req, res) ->
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

  app.get '/data/pages.json', (req, res) ->
    Page.find {}, 'route title',(err, data) ->
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

  app.post '/data/page/', (req, res) ->
    newPage = new Page(
      title: req.body.title
      author: req.body.author
      route: utils.slugify req.body.title
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

  app.post '/forgot', (req, res, next) ->
    User.findOne username: req.user.username, (err, user) ->
      if err
       res.send(500).end()
      else if data.length < 1
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
        profile = username: user.username, firstname: user.firstname, lastname:user.lastname, country: user.country
        token = jwt.sign(profile, 'this is my secret for jwt', { expiresInMinutes: 60*5 })
        res.json token: token, user: profile
    ) req, res, next

  app.get '*', (req, res) ->
    console.log 'GET ' +  req.originalUrl + ' redirect to ' + '/#' + req.originalUrl
    res.redirect '/#' + req.originalUrl
