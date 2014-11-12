mongoose = require 'mongoose'

Schema = mongoose.Schema

CategorySchema = new Schema
  id:
    type: String
    index:
      unique: true
  name:
    type: String
    required: true
  description: String
, strict: true

Category = mongoose.model "Category", CategorySchema

module.exports =
  Category: Category
  Schema: CategorySchema
