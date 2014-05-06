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
        eventEmitter.emit 'MongoConnected'
        next()
    else
      eventEmitter.emit 'MongoConnected'

    eventEmitter.on 'MongoConnected', () ->
      for i in [1..10] by 1
        do (i) ->
          newPost = new entry(
            title: 'title ' + i
            author: 'author'
            id: utils.slugify('title ' + i)
            body: 'This is a test post'
            tags: [{name: 'tag1'}]
            category: 'test'
            comments: []
            creationDate: (new Date()).getTime() + (i * 24 * 60 * 60 * 1000)
            updateDate: null
            published: true
          )
          newPost.save (err) ->
            throw err if err

  after (next) ->
    entry.find
      body: 'This is a test post'
    .remove()
    .exec()
    mongoose.disconnect
    next()

  it 'should get index page', (next) ->
    request 'http://localhost:3333/', (err, res, body) ->
      res.statusCode.should.be.eql 200
      next()

#  it 'should get login page', (next) ->
#    request 'http://localhost:3333/login', (err, res, body) ->
#      res.statusCode.should.be.eql 200
#      next()

#  it 'should post login page', (next) ->
#    next()

#  it 'should get logout page', (next) ->
#    request 'http://localhost:3333/logout', (err, res, body) ->
#      res.statusCode.should.be.eql 200
#      next()

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
      data = JSON.parse body
      data.result.should.be.eql 'OK'
      data.entries[0].id.should.be.eql 'title-1'
      next()

  it 'should get blog entries by pagination in json', (next) ->
    request 'http://localhost:3333/blog/posts/0/2/posts.json', (err, res, body) ->
      res.statusCode.should.be.eql 200
      data = JSON.parse body
      data.result.should.be.eql 'OK'
      data.entries.length.should.be.eql 2
      data.entries[0].id.should.be.eql 'title-10'
      data.entries[1].id.should.be.eql 'title-9'
      next()

  it 'should get blog entries by tag in json', (next) ->
    request 'http://localhost:3333/blog/tag/tag1/posts.json', (err, res, body) ->
      res.statusCode.should.be.eql 200
      data = JSON.parse body
      data.result.should.be.eql 'OK'
      data.entries.should.not.be.empty
      data.entries[0].tags[0].name.should.be.eql 'tag1'
      next()

  it 'should get blog entries by category in json', (next) ->
    request 'http://localhost:3333/blog/category/test/posts.json', (err, res, body) ->
      data = JSON.parse body
      data.result.should.be.eql 'OK'
      data.entries.should.not.be.empty
      data.entries[0].category.should.be.eql 'test'
      res.statusCode.should.be.eql 200
      next()

  it 'should post new blog entry', (next) ->
    request.post(
      uri: 'http://localhost:3333/blog/post/post-test.json'
      headers:
        'content-type': 'application/json'
      body: JSON.stringify
        title: 'post test'
        author: 'author'
        id: utils.slugify('post test')
        body: 'This is a test post'
        tags: [{name: 'tag1'}]
        category: 'test'
        comments: []
        creationDate: new Date() - (24 * 60 * 60 * 1000)
        updateDate: null
        published: true
    , (err, res, body) ->
      res.statusCode.should.be.eql 200
      entry.find {"id": "post-test"}, (err, data) ->
        data.should.not.be.empty
        data[0].title.should.be.eql 'post test'
        next()
    )

  it 'should del blog entry', (next) ->
    request.post(
      uri: 'http://localhost:3333/blog/post/del-test.json'
      headers:
        'content-type': 'application/json'
      body: JSON.stringify
        title: 'del test'
        author: 'author'
        body: 'This is a test post'
        tags: [{name: 'tag1'}]
        category: 'test'
        comments: []
        creationDate: new Date() - (24 * 60 * 60 * 1000)
        updateDate: null
        published: true
    , (err, res, body) ->
      res.statusCode.should.be.eql 200
      entry.find {"id": "del-test"}, (err, data) ->
        data.should.not.be.empty
        data[0].title.should.be.eql 'del test'
        request.del 'http://localhost:3333/blog/post/del-test.json'
        , (err, res, body) ->
          entry.find {"id": "del-test"}, (err, data) ->
            data.should.be.empty
            next()
    )

  it 'should put blog entry', (next) ->
    request.post(
      uri: 'http://localhost:3333/blog/post/put-test.json'
      headers:
        'content-type': 'application/json'
      body: JSON.stringify
        title: 'put test 1'
        author: 'author'
        body: 'This is a test post'
        tags: [{name: 'tag1'}]
        category: 'test'
        comments: []
        creationDate: new Date() - (24 * 60 * 60 * 1000)
        updateDate: null
        published: true
    , (err, res, body) ->
      res.statusCode.should.be.eql 200
      entry.find {"id": "put-test"}, (err, data) ->
        data.should.not.be.empty
        data[0].title.should.be.eql 'put test 1'

        request.put(
          uri: 'http://localhost:3333/blog/post/put-test.json'
          headers:
            'content-type': 'application/json'
          body: JSON.stringify
            title: 'put test 2'

        , (err, res, body) ->
          entry.find {"id": "put-test"}, (err, data) ->
            data.should.not.be.empty
            data[0].title.should.be.eql 'put test 2'
            next()
        )      
    )

  it 'should get error page', (next) ->
    request 'http://localhost:3333/error/404', (err, res, body) ->
      res.statusCode.should.be.eql 200
      next()
