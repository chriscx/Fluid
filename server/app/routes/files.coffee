path = require 'path'
fs = require 'fs'
expressJwt = require 'express-jwt'
File = require('../models/file').File


secret = process.env.SECRET || 'this is my secret for jwt'

module.exports = (app, passport, resetTokens, config, logger) ->

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
