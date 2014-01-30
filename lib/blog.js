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
  creationDate: { type: Date, default: Date.now },
  updateDate: { type: Date, default: Date.now },
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
    Entry.find({}, null, { skip: skip, limit: limit }).sort({creationDate: 'desc'}).exec(function(err, result) {
      if(!err) {
        err = null;
      }
      callback(err, result);
    });
  },

    /*
  `countEntries(callback)`
  ----------------------------
  */

  countEntries: function(callback) {
    Entry.count({}, function(err, count){
      callback(err, count);
    });
  },

  /*
  `countEntries(callback)`
  ----------------------------
  */

  countPages: function(limit, callback) {
    Entry.count({}, function(err, count){
      callback(err, Math.ceil(count/limit));
    });
  },

  /*
  `getEntry(param, callback)`
  ----------------------------
  */

  getEntry: function(param, callback) {
    Entry.find(param, function (err, data) {
      if(!err) {
        err = null;
      }
      callback(err, data);
    })
  },

  /*
  `createEntry(entry, callback)`
  ----------------------------
  */
  createEntry: function(entry, callback) {
    var newEntry = new Entry(entry);
    newEntry.save(function(err, newEntry, numberAffected) {
      if(!err) {
        err = null;
      }
      callback(err, newEntry);
    })
  },

  /*
  `removeEntry(id, callback)`
  ----------------------------

  */
  removeEntry: function(id, callback) {
    Entry.remove({'_id' : id}, function (err, data) {
      if(!err) {
        err = null;
      }
      callback(err, data);
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
      if(!err) {
        err = null;
      }
      callback(err, data);
    });
  },

  /*
  `getCategories(callback)`
  ----------------------------
  */

  getCategories: function(callback) {
    Category.find({}, function(err, result) {
      if(!err) {
        err = null;
      }
      callback(err, result);
    });
  },

  /*
  `getCategory(id, callback)`
  TODO change id by {id: id, name: name} as options
  ----------------------------
  */

  getCategory: function(id, callback) {
    Category.find({'_id': id}, function (err, data) {
      if(!err) {
        err = null;
      }
      callback(err, data);
    })
  },

  /*
  `createCategory(category, callback)`
  ----------------------------

  */
  createCategory: function(category, callback) {
    var newCategory = new Category(category);
    newCategory.save(function(err, newCategory, numberAffected) {
      if(!err) {
        err = null;
      }
      callback(err, newCategory);
    })
  },

  /*
  `removecategory(id, callback)`
  ----------------------------

  */
  removeCategory: function(id, callback) {
    Category.remove({'_id' : id}, function (err, data) {
      if(!err) {
        err = null;
      }
      callback(err, data);
    }).remove();
  },

  /*
  `editCategory(id, newCategory, callback)`
  ----------------------------

  */
  editCategory: function(id, modifiedCategory, callback) {
    if(modifiedCategory.hasOwnProperty('_id')) {
      delete modifiedCategory._id;
    }
    Category.findOneAndUpdate({_id: id}, modifiedCategory, {new: true}, function(err, data) {
      if(!err) {
        err = null;
      }
      callback(err, data);
    });
  }
};
