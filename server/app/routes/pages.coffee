expressJwt = require 'express-jwt'
getSlug = require 'speakingurl'
Page = require('../models/page').Page

secret = process.env.SECRET || 'this is my secret for jwt'

module.exports = (app, passport, resetTokens, config, logger) ->


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
