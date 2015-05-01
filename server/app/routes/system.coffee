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
User = require('../models/user').User
Page = require('../models/page').Page
Menu = require('../models/menu').Menu
Post = require('../models/blog').Post
Setting = require('../models/setting').Setting
File = require('../models/file').File


secret = process.env.SECRET || 'this is my secret for jwt'

module.exports = (app, passport, resetTokens, config, logger) ->


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
