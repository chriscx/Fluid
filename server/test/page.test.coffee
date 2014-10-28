should = require 'should'
mongoose = require 'mongoose'
Page = require('../app/models/page').Page
utils = require '../app/utils'

describe 'Pages', ->

  port = 5000
  port = process.env.PORT if process.env.port isnt `undefined`

  before (done) ->
    unless mongoose.connection.readyState
      mongoose.connect process.env.FLUID_DB, null, ->
        done()

  after (done) ->
    mongoose.disconnect done

  beforeEach (done) ->
    page = new Page
      title: 'page creation'
      author: 'author'
      route: utils.slugify('page-creation')
      body: 'This is a test page'
      creationDate: (new Date()).getTime() - (10 * 24 * 60 * 60 * 1000)
      updateDate: null
      published: true

    page.save (error) ->
      if error
        console.log 'error' + error.message
      else
        console.log 'no error'
      done()

  it 'find a page by title', (next) ->
    Page.findOne
      title: 'page creation'
    , (err, page) ->
      page.body.should.be.eql 'This is a test page'
      next()

  afterEach (done) ->
    Page.remove {title: 'page creation'}, ->
      done()
