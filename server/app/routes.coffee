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
getSlug = require 'speakingurl'
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

  passport.use "login", new LocalStrategy(
    passReqToCallback: true
  , (req, username, password, done) ->

    # check in mongo if a user with username exists or not
    User.findOne
      username: username
    , (err, user) ->

      # In case of any error, return using the done method
      return done err if err

      # Username does not exist, log error & redirect back
      unless user
        logger.info "User Not Found with username " + username
        return done null, false

      # User exists but wrong password, log the error
      unless bcrypt.compareSync password, user.password
        logger.info "Invalid Password"
        return done null, false

      # User and password both match, return user from
      # done method which will be treated like success
      done null, user
  )

  passport.use 'signup', new LocalStrategy(
    passReqToCallback : true
  , (req, username, password, done) ->
      findOrCreateUser = () ->
        # find a user in Mongo with provided username
        Setting.findOne {}, '-_id -__v', (err, data) ->
          settings = data
          if not data.accountCreation
            logger.info 'Account creation has been disabled'
            return 'Account creation has been disabled'
          User.findOne 'username': username, (err, user) ->
            # In case of any error return
            if err
              logger.error new Error(err)
              done err

            # already exists
            if user
              logger.warn "'User #{username} already exists"
              done null, false
            else
              # if there is no user with that email
              # create the user
              newUser = new User()
              # set the user's local credentials
              newUser.username = username
              newUser.password = bcrypt.hashSync password
              newUser.firstname = req.param 'firstname'
              newUser.lastname = req.param 'lastname'
              newUser.email = req.param 'email'

              # save the user
              newUser.save (err) ->
                if err
                  logger.error new Error(err)
                  throw err
                done null, newUser

      # Delay the execution of findOrCreateUser and execute
      # the method in the next tick of the event loop
      process.nextTick findOrCreateUser
  )

  passport.use 'reset', new LocalStrategy(
    passReqToCallback: true
  , (req, username, password, done) ->

    updatedPassword = {password: bcrypt.hashSync password}

    # check in mongo if a user with username exists or not
    User.findOneAndUpdate
      username: username,
      updatedPassword
    , (err, user) ->

      # In case of any error, return using the done method
      if err
        logger.error new Error(err)
        return done err

      # Username does not exist, log error & redirect back
      unless user
        logger.warn 'User ' + username + ' doesn\'t exist'
        return done null, false

      done null, user
  )

  app.get '/data/user/:user.json', expressJwt({secret: secret}), (req, res) ->
    logger.info "'GET user #{req.user.username} JSON object"
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
    logger.info "PUT user '#{req.user.username}' JSON object"
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
    logger.info "DEL user '#{req.user.username}' JSON object"
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
    logger.info "GET post list JSON object"
    Post.find {author: req.user.username}, 'id title category', (err, data) ->
      logger.info data
      unless err
        res.json data
      else
        logger.error new Error(err), {msg: 'HTTP 404'}
        res.sendStatus(404).end()

  app.get '/data/blog/post/:s/:l/posts.json', (req, res) ->
    logger.info "GET posts list of '#{req.user.username}' JSON object"
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
      id: getSlug req.body.title
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
    data.id = getSlug data.title
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
      id: getSlug req.body.name
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
    Page.find {}, 'id title', (err, data) ->
      if err
        logger.error new Error(err), {msg: 'HTTP 500'}
        res.sendStatus(500).end()
      else
        res.json data

  app.get '/data/page/:id.json', (req, res) ->
    Page.findOne {id: req.params.id}, '-_id -__v', (err, data) ->
      if err
        logger.error new Error(err), {msg: 'HTTP 500'}
        res.sendStatus(500).end()
      else
        res.json data

  app.post '/data/page/', expressJwt({secret: secret}), (req, res) ->
    newPage = new Page(
      title: req.body.title
      author: req.body.author
      id: getSlug req.body.title
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

  app.put '/data/page/:id.json', expressJwt({secret: secret}), (req, res) ->
    data = req.body
    data.id = getSlug data.title
    Page.findOneAndUpdate id: req.params.id,
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

  app.delete '/data/page/:id.json', expressJwt({secret: secret}), (req, res) ->
    Page.remove {id: req.params.id}, (err, data) ->
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

  app.post '/signup', (req, res, next) ->
    logger.info('POST signup')
    passport.authenticate('signup', (err, user, info) ->
      if err
        logger.error new Error(err), {msg: 'HTTP 500'}
        return next(err)
      unless user
        logger.error new Error(err), {msg: 'HTTP 409'}
        return res.sendStatus(409).end()
      req.logIn user, (err) ->
        return next(err) if err
        res.sendStatus(201).end()
    ) req, res, next

  app.post '/login', (req, res, next) ->
    logger.info('POST login')
    passport.authenticate('login', (err, user, info) ->
      if err
        logger.error new Error(err), {msg: 'HTTP 500'}
        return next(err)
      unless user
        logger.error new Error(err), {msg: 'HTTP 401'}
        return res.sendStatus(401).end()
      req.logIn user, (err) ->
        return next(err) if err
        profile = username: user.username, email: user.email, firstname: user.firstname, lastname: user.lastname
        token = jwt.sign(profile, 'this is my secret for jwt', { expiresInMinutes: 60*5 })
        res.json token: token, user: profile
    ) req, res, next

  app.post '/forgot', (req, res, next) ->
    User.findOne email: req.body.email, (err, user) ->
      if err
        logger.error new Error(err), {msg: 'HTTP 500'}
        res.sendStatus(500).end()
      else if user.length < 1
        logger.error new Error(err), {msg: 'HTTP 404'}
        res.sendStatus(404).end()
      else
        crypto.randomBytes 30, (err, buf) ->
          ts = (new Date()).getTime()
          token = buf.toString('hex')
          smtpTransport = null
          if smtp.service is 'smtp'
            smtpTransport = nodemailer.createTransport(smtpTransport({
              host: smtp.host,
              port: smtp.port,
              secure: smtp.ssl,
              auth:
                user: smtp.account,
                pass: smtp.password
            }))
          else
            smtpTransport = nodemailer.createTransport(
              service: smtp.service
              auth:
                user: smtp.account
                pass: smtp.password
            )
          mailOptions =
            to: user.email
            from: user.email
            subject: 'Fluid Password Reset'
            text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' + 'Please click on the following link, or paste this into your browser to complete the process:\n\n' + 'http://' + req.headers.host + '/reset/' + token + '\n\n' + 'If you did not request this, please ignore this email and your password will remain unchanged.\n'

          smtpTransport.sendMail mailOptions, (err) ->
            unless err
              resetTokens[token] = {username: user.username, email: user.email, expirationDate: ts + (24 * 60 * 60 * 100)}
              res.sendStatus(200).end()
            else
              logger.error new Error(err), {msg: 'HTTP 500'}
              res.sendStatus(500).end()

  app.post '/reset', (req, res, next) ->
    token = req.body.token
    if resetTokens[token].expirationDate < (new Date()).getTime()
      logger.error new Error(err), {msg: 'HTTP 498'}
      return res.sendStatus(498).end()
    req.body.username = resetTokens[token].username
    passport.authenticate('reset', (err, user, info) ->
      if err
        logger.error new Error(err), {msg: 'HTTP 500'}
        return next(err)
      unless user
        logger.error new Error(err), {msg: 'HTTP 401'}
        return res.sendStatus(401).end()
      req.logIn user, (err) ->
        if err
          logger.error new Error(err), {msg: 'HTTP 500'}
          return next(err)
        profile = username: user.username, email: user.email
        token = jwt.sign(profile, 'this is my secret for jwt', { expiresInMinutes: 60*5 })
        delete resetTokens[token]
        res.json token: token, user: profile
    ) req, res, next

  app.get '*', (req, res) ->
    logger.info 'GET ' +  req.originalUrl + ' redirect to ' + '/#' + req.originalUrl
    res.redirect '/#' + req.originalUrl
