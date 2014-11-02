mongoose = require 'mongoose'
Schema = mongoose.Schema

UserSchema = new Schema
  username:
    type: String
    unique: true
    required: true
  email:
  	type: String
  	index: true
  	unique: true
  password:
    type: String
    required: true
  firstname: String
  lastname: String
, strict: true

User = mongoose.model 'User', UserSchema

module.exports =
  User: User
  Schema: UserSchema
