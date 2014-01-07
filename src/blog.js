var request, database;
request = require('request');
database = require('./../config/database');

module.exports = {

  /*
  `getEntry(id, callback)`
  ----------------------------
  */

  getEntry: function(id, callback) {
    request.get(database.host() + database.dbEntries()+ '/' + id, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        console.log('request body: ' + body);
        callback(null, body);
      }
      else {
        callback(error);
      }
    });
  },

  /*
  `createEntry(entry, callback)`
  ----------------------------
  */
  createEntry: function(entry, callback) {
    request.post(database.url + '' + entry);

  },

  /*
  `removeEntry(id, callback)`
  ----------------------------

  */
  removeEntry: function(id, callback) {
    request.del(database.url + '' + id);

  },

  /*
  `editEntry(modifiedEntry, callback)`
  ----------------------------

  */
  editEntry: function(modifiedEntry, callback) {
    request.put(database.url);

  },

    /*
  `createCategory(name, callback)`
  ----------------------------

  */
  createCategory: function(name, callback) {
    request.post(database.url, entry);

  },

    /*
  `removecategory(id, callback)`
  ----------------------------

  */
  removeCategory: function(id, callback) {
    request.del(database.url + '' + id);

  },

    /*
  `editCategory(newName, callback)`
  ----------------------------

  */
  editCategory: function(newName, callback) {
    request.put(database.url);

  }
};
