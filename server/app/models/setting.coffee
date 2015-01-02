mongoose = require 'mongoose'

Schema = mongoose.Schema

SettingSchema = new Schema
  title:
    type: String
    required: true
    index:
      unique: true
  description: String
  keywords: String
  author: String
  header:
    content: String
    body: String
  footer:
    content: String
    body: String
  accountCreation: Boolean


Setting = mongoose.model "Setting", SettingSchema

module.exports =
  Setting: Setting
  Schema: SettingSchema
