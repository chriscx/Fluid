config = require '../app/config'
should = require 'should'
mongoose = require 'mongoose'
User = require('../app/models/user').User

describe 'User', ->
  before (done) ->
    unless mongoose.connection.readyState
      mongoose.connect config.db_test, null, ->
        done()

  after (done) ->
    mongoose.disconnect done

  beforeEach (done) ->
    user = new User
      username: "12345"
      password: "testy"

    user.save (error) ->
      if error
        console.log "error" + error.message
      done()

  it "find a user by username", (next) ->
    User.findOne username: "12345", (err, user) ->
      user.username.should.eql "12345"
      next()

  afterEach (done) ->
    User.remove {}, ->
      done()
