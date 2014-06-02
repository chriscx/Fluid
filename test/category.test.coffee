should = require 'should'
mongoose = require 'mongoose'
Category = require('../app/models/category').Category
utils = require '../app/controllers/utils'

describe 'Category', ->
  before (done) ->
    unless mongoose.connection.readyState
      mongoose.connect 'mongodb://localhost/fluiddb_dev', null, ->
        done()

  after (done) ->
    mongoose.disconnect done

  beforeEach (done) ->
    category = new Category
      name: "category1"
      description: "description..."

    category.save (error) ->
      if error
        console.log "error" + error.message
      else
        console.log "no error"
      done()

  it "find an category by name", (next) ->
    Category.findOne
      name: "category1"
    , (err, category) ->
      category.description.should.be.eql "description..."
      next()

  afterEach (done) ->
    Category.remove {name: "category1"}, ->
      done()
