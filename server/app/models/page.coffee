mongoose = require 'mongoose'

Schema = mongoose.Schema

PageSchema = new Schema
  title:
    type: String
    index:
      unique: true
  author: String
  id: String
  body: String      # html
  creationDate:
    type: Date
    default: Date.now
  updateDate:
    type: Date
    default: Date.now
  published: Boolean
, strict: true

Page = mongoose.model 'Page', PageSchema

module.exports =
  Page: Page
  Schema: PageSchema
