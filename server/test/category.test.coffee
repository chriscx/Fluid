should = require 'should'
mongoose = require 'mongoose'
Category = require('../app/models/category').Category
utils = require '../app/utils'

describe 'Category', ->

  port = 5000
  port = process.env.PORT if process.env.port isnt `undefined`

  before (done) ->
    unless mongoose.connection.readyState
      mongoose.connect process.env.FLUID_DB, null, ->
        done()

  after (done) ->
    mongoose.disconnect done

  beforeEach (done) ->
    category = new Category
      id: 'category1'
      name: 'category1'
      description: 'description...'

    category.save (error) ->
      if error
        console.log 'error' + error.message
      else
        console.log 'no error'
      done()

  it 'find an category by name', (next) ->
    Category.findOne
      name: 'category1'
    , (err, category) ->
      category.description.should.be.eql 'description...'
      next()

  afterEach (done) ->
    Category.remove {name: 'category1'}, ->
      done()
