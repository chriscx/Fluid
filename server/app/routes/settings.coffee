expressJwt = require 'express-jwt'
jade = require 'jade'
Setting = require('../models/setting').Setting

secret = process.env.SECRET || 'this is my secret for jwt'

module.exports = (app, passport, resetTokens, config, logger) ->


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
