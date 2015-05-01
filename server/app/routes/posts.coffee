expressJwt = require 'express-jwt'
getSlug = require 'speakingurl'
Post = require('../models/blog').Post

secret = process.env.SECRET || 'this is my secret for jwt'

module.exports = (app, passport, resetTokens, config, logger) ->

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
