path = require 'path'
fs = require 'fs'
expressJwt = require 'express-jwt'
jwt = require 'jsonwebtoken'
nodemailer = require 'nodemailer'
smtpTransport = require 'nodemailer-smtp-transport'
crypto = require 'crypto'
Hashids = require 'hashids'
hash = new Hashids('this is my salt')
bcrypt = require 'bcrypt-nodejs'
jade = require 'jade'
LocalStrategy = require('passport-local').Strategy
utils = require './utils'
User = require('./models/user').User
Page = require('./models/page').Page
Menu = require('./models/menu').Menu
Post = require('./models/blog').Post
Setting = require('./models/setting').Setting
File = require('./models/file').File

secret = process.env.SECRET || 'this is my secret for jwt'

module.exports = (app, passport, resetTokens, config, logger) ->

  Setting.findOne {}, '-_id -__v', (err, data) ->
    if err
      throw err
    options = data
    html = jade.renderFile "#{__dirname}/../../client/app/index.jade", options
    fs.writeFile "#{__dirname}/../../client/public/index.html", html, (err) ->
      if err
        throw err

  app.get '/data/user/:user.json', expressJwt({secret: secret}), (req, res) ->
    logger.info 'GET user \'' + req.user.username + '\' JSON object'
    User.findOne {username: req.user.username}, '-_id -__v -password', (err, data) ->
      delete data.password
      if err
        logger.error new Error(err), {msg: 'HTTP 500'}
        res.sendStatus(500).end()
      else if data is `undefined`
        logger.error new Error(err), {msg: 'HTTP 404'}
        res.sendStatus(404).end()
      else
        res.json data

  app.put '/data/user/:user.json', expressJwt({secret: secret}), (req, res) ->
    logger.info 'PUT user \'' + req.user.username + '\' JSON object'
    req.body.password = bcrypt.hashSync req.body.password
    User.findOneAndUpdate username: req.user.username,
      req.body,
      new: true,
        (err, data) ->
          if err
            logger.error new Error(err), {msg: 'HTTP 500'}
            res.sendStatus(500).end()
          else if data is `undefined`
            logger.error new Error(err), {msg: 'HTTP 404'}
            res.sendStatus(404).end()
          else
            res.sendStatus(200).end()

  app.delete '/data/user/:user.json', expressJwt({secret: secret}), (req, res) ->
    logger.info 'DEL user \'' + req.user.username + '\' JSON object'
    User.remove {'username': req.user.username}, (err, data) ->
      if err
        logger.error new Error(err), {msg: 'HTTP 500'}
        res.sendStatus(500).end()
      else if data.length < 1
        logger.error new Error(err), {msg: 'HTTP 404'}
        res.sendStatus(404).end()
      else
        res.sendStatus(200).end()

  app.get '/data/blog/posts.json', expressJwt({secret: secret}), (req, res) ->
    logger.info('GET playlist list of \'' + req.user.username + '\' JSON object')
    Post.find {author: req.user.username}, 'id title category', (err, data) ->
      logger.info data
      unless err
        res.json data
      else
        logger.error new Error(err), {msg: 'HTTP 404'}
        res.sendStatus(404).end()

  app.get '/data/blog/post/:s/:l/posts.json', (req, res) ->
    Post.find {}, '-_id -__v', {'skip': req.params.s, 'limit': req.params.l}
      .sort
        creationDate: 'desc'
      .exec (err, data) ->
        if err
          logger.error new Error(err), {msg: 'HTTP 500'}
          res.sendStatus(500).end()
        else
          res.json data

  app.get '/data/blog/post/:id.json', (req, res) ->
    Post.findOne {'id': req.params.id}, '-_id -__v', (err, data) ->
      if err
        logger.error new Error(err), {msg: 'HTTP 500'}
        res.sendStatus(500).end()
      else
        res.json data

  app.post '/data/blog/post/', expressJwt({secret: secret}), (req, res) ->

    logger.info req.body

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
        logger.error new Error(err), {msg: 'HTTP 500'}
        res.sendStatus(500).end()
      else
        res.sendStatus(200).end()

  app.put '/data/blog/post/:id.json', expressJwt({secret: secret}), (req, res) ->
    data = req.body
    data.id = utils.slugify data.title
    Post.findOneAndUpdate 'id': req.params.id,
      data,
      new: true,
        (err, data) ->
          if err
            logger.error new Error(err), {msg: 'HTTP 500'}
            res.sendStatus(500).end()
          else if data is `undefined`
            logger.error new Error(err), {msg: 'HTTP 404'}
            res.sendStatus(404).end()
          else
            res.sendStatus(200).end()

  app.delete '/data/blog/post/:id.json', expressJwt({secret: secret}), (req, res) ->
    Post.remove 'id': req.params.id, (err, data) ->
      if err
        logger.error new Error(err), {msg: 'HTTP 500'}
        res.sendStatus(500).end()
      else if data.length < 1
        logger.error new Error(err), {msg: 'HTTP 404'}
        res.sendStatus(404).end()
      else
        res.sendStatus(200).end()

  app.get '/data/blog/tag/:name/posts.json', (req, res) ->
    Post.find {'tags.name': req.params.name}, '-_id -__v', (err, data) ->
      if err
        logger.error new Error(err), {msg: 'HTTP 500'}
        res.sendStatus(500).end()
      else
        res.json data

  app.get '/data/blog/category/:name/posts.json', (req, res) ->
    Post.find {'category': req.params.name}, '-_id -__v', (err, data) ->
      if err
        logger.error new Error(err), {msg: 'HTTP 500'}
        res.sendStatus(500).end()
      else
        res.json data

  app.get '/data/blog/categories.json', (req, res) ->
    Post.find({}).distinct 'category', (err, data) ->
      if err
        logger.error new Error(err), {msg: 'HTTP 500'}
        res.sendStatus(500).end()
      else
        res.json data

  app.get '/data/menu.json', (req, res) ->
    Menu.find {}, '-_id -__v', (err, data) ->
      if err
        logger.error new Error(err), {msg: 'HTTP 500'}
        res.sendStatus(500).end()
      else
        res.json data

  app.get '/data/menu/:id.json', (req, res) ->
    Menu.findOne {id: req.params.id}, '-_id -__v', (err, data) ->
      if err
        logger.error new Error(err), {msg: 'HTTP 500'}
        res.sendStatus(500).end()
      else
        res.json data

  app.post '/data/menu/', (req, res) ->
    # if route is updated, the menu link will be void
    newMenu = new Menu(
      id: utils.slugify req.body.name
      name: req.body.name
      route: req.body.route
      description: req.body.description
      order: req.body.order
    )

    newMenu.save (err) ->
      if err
        logger.error new Error(err), {msg: 'HTTP 500'}
        res.sendStatus(500).end()
      else
        res.sendStatus(200).end()

  app.put '/data/menu/:id.json', (req, res) ->
    Menu.findOneAndUpdate {id: req.params.id},
    req.body,
    new: true,
      (err, data) ->
        if err
          logger.error new Error(err), {msg: 'HTTP 500'}
          res.sendStatus(500).end()
        else
          res.sendStatus(200).end()

  app.delete '/data/menu/:id.json', (req, res) ->
    Menu.remove {id: req.params.id}, (err, data) ->
      if err
        logger.error new Error(err), {msg: 'HTTP 500'}
        res.sendStatus(500).end()
      else if data.length < 1
        logger.error new Error(err), {msg: 'HTTP 404'}
        res.sendStatus(404).end()
      else
        res.sendStatus(200).end()

  app.get '/data/settings.json', (req, res) ->
    Setting.findOne {}, '-_id -__v', (err, data) ->
      if err
        logger.error new Error(err), {msg: 'HTTP 500'}
        res.sendStatus(500).end()
      else
        res.json data

  app.post '/data/settings.json', (req, res) ->
    set = req.body
    newSetting = new Setting(set)
    newSetting.save (err) ->
      if err
        logger.error new Error(err), {msg: 'HTTP 500'}
        res.sendStatus(500).end()
      else
        res.sendStatus(200).end()

  app.put '/data/settings.json', (req, res) ->
    set = req.body
    Setting.findOneAndUpdate {},
    set,
    new: true,
      (err, data) ->
        if err
          logger.error new Error(err), {msg: 'HTTP 500'}
          res.sendStatus(500).end()
        else if data is null
          newSetting = new Setting(set)
          newSetting.save (err) ->
            if err
              logger.error new Error(err), {msg: 'HTTP 500'}
              res.sendStatus(500).end()
            else
              res.sendStatus(200).end()
        else
          Setting.findOne {}, '-_id -__v', (err, data) ->
            if err
              logger.error new Error(err), {msg: 'HTTP 500'}
              res.sendStatus(500).end()
            else
              options = data
              html = jade.renderFile "#{__dirname}/../../client/app/index.jade", options
              fs.writeFile "#{__dirname}/../../client/public/index.html", html, (err) ->
                if err
                  logger.error new Error(err), {msg: 'HTTP 500'}
                  res.sendStatus(500).end()
                else
                  res.sendStatus(200).end()

  app.delete '/data/settings.json', (req, res) ->
    Setting.remove {}, (err, data) ->
      if err
        logger.error new Error(err), {msg: 'HTTP 500'}
        res.sendStatus(500).end()
      else if data.length < 1
        logger.error new Error(err), {msg: 'HTTP 404'}
        res.sendStatus(404).end()
      else
        res.sendStatus(200).end()

  app.get '/data/pages.json', (req, res) ->
    Page.find {}, 'route title', (err, data) ->
      if err
        logger.error new Error(err), {msg: 'HTTP 500'}
        res.sendStatus(500).end()
      else
        res.json data

  app.get '/data/page/:route.json', (req, res) ->
    Page.findOne {route: req.params.route}, '-_id -__v', (err, data) ->
      if err
        logger.error new Error(err), {msg: 'HTTP 500'}
        res.sendStatus(500).end()
      else
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
        logger.error new Error(err), {msg: 'HTTP 500'}
        res.sendStatus(500).end()
      else
        res.sendStatus(200).end()

  app.put '/data/page/:route.json', expressJwt({secret: secret}), (req, res) ->
    data = req.body
    data.route = utils.slugify data.title
    Page.findOneAndUpdate route: req.params.route,
    data,
    new: true,
      (err, data) ->
        if err
          logger.error new Error(err), {msg: 'HTTP 500'}
          res.sendStatus(500).end()
        else if data is `undefined`
          res.sendStatus(404).end()
        else
          res.sendStatus(200).end()

  app.delete '/data/page/:route.json', expressJwt({secret: secret}), (req, res) ->
    Page.remove {route: req.params.route}, (err, data) ->
      if err
        logger.error new Error(err), {msg: 'HTTP 500'}
        res.sendStatus(500).end()
      else if data.length < 1
        logger.error new Error(err), {msg: 'HTTP 404'}
        res.sendStatus(404).end()
      else
        res.sendStatus(200).end()

  app.get '/data/files.json', expressJwt({secret: secret}), (req, res) ->
    File.find {}, 'id path', (err, data) ->
      if err
        logger.error new Error(err), {msg: 'HTTP 500'}
        res.sendStatus(500).end()
      else
        res.json data

  app.post '/data/files', (req, res) ->
    req.pipe req.busboy
    req.busboy.on "file", (fieldname, file, filename) ->
      logger.info "Uploading: " + filename
      fstream = fs.createWriteStream("#{__dirname}/../../client/public/media/" + filename)
      file.pipe fstream
      fstream.on "close", ->
        file = File(
          id: filename
          path: filename
        )
        file.save()
        res.redirect('/admin/files')

  app.delete '/data/files/:id', expressJwt({secret: secret}), (req, res) ->
    logger.info req.params.id
    File.findOne {id: req.params.id}, (err, data) ->
      logger.info data
      fs.unlink "#{__dirname}/../../client/public/media/" + data.path, (err) ->
        if err
          logger.error new Error(err), {msg: 'HTTP 500'}
          res.sendStatus(500).end()
        File.remove {id: req.params.id}, (err, data) ->
          if err
            logger.error new Error(err), {msg: 'HTTP 500'}
            res.sendStatus(500).end()
          else
            res.sendStatus(200).end()
