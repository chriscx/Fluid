expressJwt = require 'express-jwt'
jwt = require 'jsonwebtoken'
nodemailer = require 'nodemailer'
smtpTransport = require 'nodemailer-smtp-transport'
crypto = require 'crypto'
Hashids = require 'hashids'
hash = new Hashids('this is my salt')
bcrypt = require 'bcrypt-nodejs'
LocalStrategy = require('passport-local').Strategy
utils = require './utils'
User = require('./models/user').User

module.exports = (app, passport, resetTokens, config, logger) ->

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
              logger.warn 'User ' + username + ' already exists'
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

    logger.info 'new password ' + password
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
