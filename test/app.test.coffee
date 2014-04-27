mongoose = require 'mongoose'
should = require 'should'
request = require 'request'

describe 'app', ->
  before (next) ->
    unless mongoose.connection.readyState
      mongoose.connect 'mongodb://localhost/fluiddb_dev', null, ->
        next()

  after (next) ->
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

  it 'should get admin page', (next) ->
    request 'http://localhost:3333/admin', (err, res, body) ->
      res.statusCode.should.be.eql 200
      next()

  it 'should get blog page', (next) ->
    request 'http://localhost:3333/blog', (err, res, body) ->
      res.statusCode.should.be.eql 200
      next()

  it 'should get blog post page', (next) ->
    next()

  it 'should get blog entries by pagination', (next) ->
    next()

  it 'should get blog entries by tag', (next) ->
    next()

  it 'should get blog entries by category', (next) ->
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
