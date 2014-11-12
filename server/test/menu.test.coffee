should = require 'should'
mongoose = require 'mongoose'
Menu = require('../app/models/menu').Menu
utils = require '../app/utils'

describe 'Menu', ->

  port = 5000
  port = process.env.PORT if process.env.port isnt `undefined`

  before (done) ->
    unless mongoose.connection.readyState
      mongoose.connect process.env.FLUID_DB, null, ->
        done()

  after (done) ->
    mongoose.disconnect done

  beforeEach (done) ->
    menu = new Menu
      id: 'menu1'
      name: 'menu1'
      route: 'route1'
      description: 'description...'

    menu.save (error) ->
      if error
        console.log 'error' + error.message
      else
        console.log 'no error'
      done()

  it 'find an menu by name', (next) ->
    Menu.findOne
      name: 'menu1'
    , (err, menu) ->
      menu.description.should.be.eql 'description...'
      next()

  afterEach (done) ->
    Menu.remove {name: 'menu1'}, ->
      done()
