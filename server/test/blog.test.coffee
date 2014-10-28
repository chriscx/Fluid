should = require 'should'
mongoose = require 'mongoose'
Post = require('../app/models/blog').Post
utils = require '../app/utils'

describe 'Blog', ->

  port = 5000
  port = process.env.PORT if process.env.port isnt `undefined`

  before (done) ->
    unless mongoose.connection.readyState
      mongoose.connect process.env.FLUID_DB, null, ->
        done()

  after (done) ->
    mongoose.disconnect done

  beforeEach (done) ->
    post = new Post
      title: 'post creation'
      author: 'author'
      id: utils.slugify('post-creation')
      body: 'This is a test post'
      tags: [{name: 'tag1'}]
      category: 'test'
      comments: []
      creationDate: (new Date()).getTime() - (10 * 24 * 60 * 60 * 1000)
      updateDate: null
      published: true

    post.save (error) ->
      if error
        console.log 'error' + error.message
      else
        console.log 'no error'
      done()

  it 'find an post by id', (done) ->
    Post.findOne
      id: 'post-creation'
    , (err, post) ->
      post.title.should.be.eql 'post creation'
      done()

  afterEach (done) ->
    Post.remove {id: 'post-creation'}, ->
      done()
