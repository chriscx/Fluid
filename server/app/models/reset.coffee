mongoose = require 'mongoose'

Schema = mongoose.Schema

ResetTokenSchema = new Schema
  id:
    type: String
    required: true
    index:
      unique: true
  username:
    type: String
    required: true
  email:
    type: String
    required: true
  expirationDate: Date
, strict: true

ResetToken = mongoose.model "ResetToken", ResetTokenSchema

module.exports =
  ResetToken: ResetToken
  Schema: ResetTokenSchema
