var mongoose;

mongoose  = require('mongoose');

var Schema = mongoose.Schema;

var entrySchema = new Schema({
  title:  String,
  author: String,
  url:    String,
  body:   String,
  tags: [{name: String}],
  category: String,
  comments: [{ body: String, date: Date }],
  date: { type: Date, default: Date.now },
  published: Boolean,
}, {collection: 'entries'});

var Entry = mongoose.model('Entry', entrySchema);

var categorySchema = new Schema({
  name: String
}, {collection: 'categories'});

var Category = mongoose.model('Category', categorySchema);

module.exports = {

  /*
  `getEntries(limit, skip, callback)`
  ----------------------------
  */

  getEntries: function(limit, skip, callback) {
    Entry.find({}, null, { skip: skip, limit: limit }).sort({date: -1}).execFind(function(err, result) {
      if (err) {
        callback(err);
      }
      else {
        callback(null, result);
      }
    });
  },

  /*
  `getEntry(title, callback)`
  ----------------------------
  */

  getEntry: function(title, callback) {
    Entry.find({'title' : title}, function (err, data) {
      if (err) {
        callback(err);
      }
      else {
        callback(null, data);
      }
    })
  },

  /*
  `createEntry(entry, callback)`
  ----------------------------
  */
  createEntry: function(entry, callback) {
    var newEntry = new Entry(entry);
    newEntry.save(function(err, newEntry, numberAffected) {
      if(err) {
        callback(err);
      }
      else {
        callback(null, newEntry);
      }
    })
  },

  /*
  `removeEntry(id, callback)`
  ----------------------------

  */
  removeEntry: function(id, callback) {
    Entry.remove({'_id' : id}, function (err, data) {
      if (err) {
        callback(err);
      }
        callback(null, data);
    }).remove();
  },

  /*
  `editEntry(modifiedEntry, callback)`
  ----------------------------

  */
  editEntry: function(id, modifiedEntry, callback) {
    if(modifiedEntry.hasOwnProperty('_id')) {
      delete modifiedEntry._id;
    }
    Entry.findOneAndUpdate({_id: id}, modifiedEntry, {new: true}, function(err, data) {
      if(err) {
        console.log(err);
        callback(err);
      }
      else {
        console.log(data);
        callback(null, data);
      }
    });
  },

  /*
  `getCategories(callback)`
  ----------------------------
  */

  getCategories: function(callback) {
    Category.find({}, function(err, result) {
      if (err) {
        callback(err);
      }
      else {
        callback(null, result);
      }
    });
  },

  /*
  `createCategory(category, callback)`
  ----------------------------

  */
  createCategory: function(category, callback) {
    var newCategory = new Category(category);
    newCategory.save(function(err, newCategory, numberAffected) {
      if(err) {
        callback(err);
      }
      else {
        callback(null, newCategory);
      }
    })
  },

  /*
  `removecategory(id, callback)`
  ----------------------------

  */
  removeCategory: function(name, callback) {
    Category.remove({'name' : name}, function (err, data) {
      if (err) {
        callback(err);
      }
        callback(null, data);
    }).remove();
  },

  /*
  `editCategory(id, newCategory, callback)`
  ----------------------------

  */
  editCategory: function(id, modifiedCategory, callback) {
    if(modifiedCategory.hasOwnProperty('_id')) {
      console.log('id: ' + modifiedCategory._id);
      var id = modifiedCategory._id;
      delete modifiedCategory._id;
      Category.update({_id: id}, modifiedCategory, {upsert: true}, function(err){
        if (err) {
          callback(err);
        };
      });
    }
    else {
      callback("No id provided. Couldn't update category");
    }
  }
};
