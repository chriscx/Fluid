should = require 'should'
mongoose = require 'mongoose'
User = require('../app/models/user').User

describe 'User', ->

  port = 5000
  port = process.env.PORT if process.env.port isnt `undefined`

  before (done) ->
    unless mongoose.connection.readyState
      mongoose.connect process.env.FLUID_DB, null, ->
        done()

  after (done) ->
    mongoose.disconnect done

  beforeEach (done) ->
    user = new User
      username: '12345'
      password: 'testy'

    user.save (error) ->
      if error
        console.log 'error' + error.message
      done()

  it 'find a user by username', (next) ->
    User.findOne username: '12345', (err, user) ->
      user.username.should.eql '12345'
      next()

  afterEach (done) ->
    User.remove {}, ->
      done()
