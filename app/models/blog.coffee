mongoose = require('mongoose')

Schema = mongoose.Schema

entrySchema = new Schema(
  title:
    type: String
    index:
      unique: true
  author: String
  url: String
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
)

Entry = mongoose.model('Entry', entrySchema)

module.exports =
  Entry: Entry
  Schema: entrySchema