mongoose = require("mongoose")
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
,
  collection: "entries"
)
Entry = mongoose.model("Entry", entrySchema)
categorySchema = new Schema(
  name: String
,
  collection: "categories"
)
Category = mongoose.model("Category", categorySchema)
module.exports =
  
  #
  #  `getEntries(limit, skip, callback)`
  #  ----------------------------
  #  
  getEntries: (limit, skip, callback) ->
    Entry.find({}, null,
      skip: skip
      limit: limit
    ).sort(creationDate: "desc").exec (err, result) ->
      err = null  unless err
      callback err, result

  #
  #  `countEntries(callback)`
  #  ----------------------------
  #  
  countEntries: (callback) ->
    Entry.count {}, (err, count) ->
      callback err, count

  #
  #  `countEntries(callback)`
  #  ----------------------------
  #  
  countPages: (limit, callback) ->
    Entry.count {}, (err, count) ->
      callback err, Math.ceil(count / limit)

  #
  #  `getEntry(param, callback)`
  #  ----------------------------
  #  
  getEntry: (param, callback) ->
    Entry.find param, (err, data) ->
      err = null  unless err
      callback err, data

  #
  #  `createEntry(entry, callback)`
  #  ----------------------------
  #  
  createEntry: (entry, callback) ->
    newEntry = new Entry(entry)
    newEntry.save (err, newEntry, numberAffected) ->
      err = null  unless err
      callback err, newEntry

  #
  #  `removeEntry(id, callback)`
  #  ----------------------------
  #
  #  
  removeEntry: (id, callback) ->
    Entry.remove(
      _id: id
    , (err, data) ->
      err = null  unless err
      callback err, data
    ).remove()

  #
  #  `editEntry(modifiedEntry, callback)`
  #  ----------------------------
  #
  #  
  editEntry: (id, modifiedEntry, callback) ->
    delete modifiedEntry._id  if modifiedEntry.hasOwnProperty("_id")
    Entry.findOneAndUpdate
      _id: id
    , modifiedEntry,
      new: true
    , (err, data) ->
      err = null  unless err
      callback err, data

  #
  #  ` `
  #  ----------------------------
  #  
  getTags: (callback) ->
    Entry.find {}, (err, data) ->
      array = new Array()
      map = {}
      i = undefined
      j = undefined
      for i of data
        array = array.concat(data[i].tags)
      for i of array
        if array[i].name of map
          map[array[i].name] += 1
        else
          map[array[i].name] = 1
      callback err, map

  #
  #  `getCategories(callback)`
  #  ----------------------------
  #  
  getCategories: (callback) ->
    Category.find {}, (err, result) ->
      err = null  unless err
      callback err, result

  #
  #  `getCategory(id, callback)`
  #  TODO change id by {id: id, name: name} as options
  #  ----------------------------
  #  
  getCategory: (id, callback) ->
    Category.find
      _id: id
    , (err, data) ->
      err = null  unless err
      callback err, data

  #
  #  `createCategory(category, callback)`
  #  ----------------------------
  #
  #  
  createCategory: (category, callback) ->
    newCategory = new Category(category)
    newCategory.save (err, newCategory, numberAffected) ->
      err = null  unless err
      callback err, newCategory
  #
  #  `removecategory(id, callback)`
  #  ----------------------------
  #
  #  
  removeCategory: (id, callback) ->
    Category.remove(
      _id: id
    , (err, data) ->
      err = null  unless err
      callback err, data
    ).remove()

  #
  #  `editCategory(id, newCategory, callback)`
  #  ----------------------------
  #
  #  
  editCategory: (id, modifiedCategory, callback) ->
    delete modifiedCategory._id  if modifiedCategory.hasOwnProperty("_id")
    Category.findOneAndUpdate
      _id: id
    , modifiedCategory,
      new: true
    , (err, data) ->
      err = null  unless err
      callback err, data