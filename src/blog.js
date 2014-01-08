var request, database, mongoose, db;

request   = require('request');
database  = require('./../config/database');
mongoose  = require('mongoose');

mongoose.connect('mongodb://localhost/fluiddb');

var Schema = mongoose.Schema;

var entrySchema = new Schema({
  title:  String,
  author: String,
  url:    String,
  body:   String,
  comments: [{ body: String, date: Date }],
  date: { type: Date, default: Date.now },
  published: Boolean,
});

var Entry = mongoose.model('Entry', entrySchema);

module.exports = {

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
  editEntry: function(modifiedEntry, callback) {

  },

    /*
  `createCategory(name, callback)`
  ----------------------------

  */
  createCategory: function(name, callback) {


  },

    /*
  `removecategory(id, callback)`
  ----------------------------

  */
  removeCategory: function(id, callback) {

  },

    /*
  `editCategory(newName, callback)`
  ----------------------------

  */
  editCategory: function(newName, callback) {

  }
};
