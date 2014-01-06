var request, database;
request = require('request');
database = require('./../config/database');

module.exports = {
  /*
  `getEntry(id, callback)`
  ----------------------------
  */

  getEntry: function(id, callback) {
    request.get(database.url + '' + id);
    request.on('error', callback);
  },
  /*
  `createEntry(entry, callback)`
  ----------------------------
  */

  createEntry: function(entry, callback) {
    request.post(database.url + '' + entry);
    request.on('error', callback);
  },

  /*
  `removeEntry(id, callback)`
  ----------------------------

  */

  removeEntry: function(id, callback) {
    request.del(database.url + '' + id);
    request.on('error', callback);
  },

  /*
  `editEntry(modifiedEntry, callback)`
  ----------------------------

  */

  editEntry: function(modifiedEntry, callback) {
    request.put(database.url);
    request.on('error', callback);
  },

    /*
  `createCategory(name, callback)`
  ----------------------------

  */

  createCategory: function(name, callback) {
    request.post(database.url, entry);
    request.on('error', callback);
  },

    /*
  `removecategory(id, callback)`
  ----------------------------

  */

  removeCategory: function(id, callback) {
    request.del(database.url + '' + id);
    request.on('error', callback);
  },

    /*
  `editCategory(newName, callback)`
  ----------------------------

  */

  editCategory: function(newName, callback) {
    request.put(database.url);
    request.on('error', callback);
  }
};
