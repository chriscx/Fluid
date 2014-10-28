mongoose = require 'mongoose'

Schema = mongoose.Schema

PostSchema = new Schema
  title:
    type: String
    index:
      unique: true
  author: String
  id: String
  body: String
  tags: [name: String]
  category: String
  comments: [
    body: String
    date: Date
  ]
  creationDate:
    type: Date
    default: Date.now
  updateDate:
    type: Date
    default: Date.now
  published: Boolean
, strict: true 

Post = mongoose.model 'Post', PostSchema

module.exports =
  Post: Post
  Schema: PostSchema
