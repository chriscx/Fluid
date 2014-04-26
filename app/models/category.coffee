mongoose = require 'mongoose'

CategorySchema = new Schema
  name: String
  description: String

Category = mongoose.model "Category", categorySchema

module.exports =
  Category: Category
  Schema: CategorySchema
