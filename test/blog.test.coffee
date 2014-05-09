should = require 'should'
mongoose = require 'mongoose'
Entry = require('../app/models/blog').Entry
utils = require '../app/controllers/utils'

describe 'Blog', ->
  before (done) ->
    unless mongoose.connection.readyState
      mongoose.connect 'mongodb://localhost/fluiddb_dev', null, ->
        done()

  after (done) ->
    mongoose.disconnect done

  beforeEach (done) ->
    entry = new Entry
      title: 'entry creation'
      author: 'author'
      id: utils.slugify('entry-creation')
      body: 'This is a test post'
      tags: [{name: 'tag1'}]
      category: 'test'
      comments: []
      creationDate: (new Date()).getTime() - (10 * 24 * 60 * 60 * 1000)
      updateDate: null
      published: true

    entry.save (error) ->
      if error
        console.log "error" + error.message
      else
        console.log "no error"
      done()

  it "find an entry by id", (next) ->
    Entry.findOne
      id: "entry-creation"
    , (err, entry) ->
      entry.title.should.be.eql "entry creation"
      next()

  afterEach (done) ->
    Entry.remove {id: "entry-creation"}, ->
      done()
