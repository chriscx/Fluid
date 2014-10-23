mongoose = require 'mongoose'

Schema = mongoose.Schema

CategorySchema = new Schema
  name: String
  description: String

Category = mongoose.model "Category", CategorySchema

module.exports =
  Category: Category
  Schema: CategorySchema
