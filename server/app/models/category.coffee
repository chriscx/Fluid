mongoose = require 'mongoose'

Schema = mongoose.Schema

CategorySchema = new Schema
  name: String
  description: String
, strict: true

Category = mongoose.model "Category", CategorySchema

module.exports =
  Category: Category
  Schema: CategorySchema
