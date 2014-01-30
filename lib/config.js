var mongoose;

mongoose  = require('mongoose');

var Schema = mongoose.Schema;

var configSchema = new Schema({
  name: String,
  value: String
}, {collection: 'config'});

var Config = mongoose.model('Config', configSchema);

module.exports = {
  put: function(name, value, callback) {
    var conf = {
      name: name,
      value: value
    };

    var newConfig = new Config(conf);

    newConfig.save(function(err, savedConfig) {
      callback(err, savedConfig);
    });
  },

  get: function(name, callback) {
    Config.find({name: name}, function(err, data) {
      callback(err, data);
    });
  },

  del: function(name, callback) {
    Config.remove({name: name}, function(err, data) {
      callback(err, data);
    });
  }
}