mongoose = require 'mongoose'
should = require 'should'
request = require 'request'
events = require 'events'
eventEmitter = new events.EventEmitter()

utils = require '../app/controllers/utils'

entry = require('../app/models/blog').Entry
entrySchema = require('../app/models/blog').Schema

category = require('../app/models/category').Category
categorySchema = require('../app/models/category').Schema

account = require('../app/models/account').Account
accountSchema = require('../app/models/account').Schema

describe 'app', ->
  before (next) ->

    unless mongoose.connection.readyState
      mongoose.connect 'mongodb://localhost/fluiddb_dev', null, ->
        next()
    else
      eventEmitter.emit 'MongoConnected'

    eventEmitter.on 'MongoConnected', () ->
      for i in [1..10] by 1
        do (i) ->
          entrySchema.title = 'title ' + i
          entrySchema.author = 'author'
          entrySchema.url = utils.slugify 'title'
          entrySchema.body = 'This is a test post'
          entrySchema.tags = [{name: 'tag1'}]
          entrySchema.category = 'test'
          entrySchema.comments = []
          entrySchema.creationDate = new Date()
          entrySchema.updateDate = null
          entrySchema.published = true
          entry.save entrySchema, (err) ->
            throw err if err

  after (next) ->
    entry.find({body: 'This is a test post'}).remove().exec()
    mongoose.disconnect ->
      next()

  it 'should get index page', (next) ->
    request 'http://localhost:3333/', (err, res, body) ->
      res.statusCode.should.be.eql 200
      next()

  it 'should get login page', (next) ->
    request 'http://localhost:3333/login', (err, res, body) ->
      res.statusCode.should.be.eql 200
      next()

  it 'should post login page', (next) ->
    next()

  it 'should get logout page', (next) ->
    request 'http://localhost:3333/logout', (err, res, body) ->
      res.statusCode.should.be.eql 200
      next()

  # it 'should get admin page', (next) ->
  #   request 'http://localhost:3333/admin', (err, res, body) ->
  #     res.statusCode.should.be.eql 200
  #     next()

  it 'should get blog page', (next) ->
    request 'http://localhost:3333/blog', (err, res, body) ->
      res.statusCode.should.be.eql 200
      next()

  it 'should get single entry in json', (next) ->
    request 'http://localhost:3333/blog/post/title-1.json', (err, res, body) ->
      res.statusCode.should.be.eql 200
      # add test
    next()

  it 'should get blog entries by pagination in json', (next) ->
    request 'http://localhost:3333/blog/posts/0-2/data.json', (err, res, body) ->
      res.statusCode.should.be.eql 200
    next()

  it 'should get blog entries by tag in json', (next) ->
    request 'http://localhost:3333/blog/tag/:name/posts.json', (err, res, body) ->
      res.statusCode.should.be.eql 200
    next()

  it 'should get blog entries by category in json', (next) ->
    request 'http://localhost:3333/blog/category/:name/posts.json', (err, res, body) ->
      res.statusCode.should.be.eql 200
    next()

  it 'should post new blog entry', (next) ->
    next()

  it 'should del blog entry', (next) ->
    next()

  it 'should put blog entry', (next) ->
    next()

  it 'should get error page', (next) ->
    request 'http://localhost:3333/error/404', (err, res, body) ->
      res.statusCode.should.be.eql 200
      next()
