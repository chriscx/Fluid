var mongoose, Schema, configSchema, Config;

mongoose  = require('mongoose');

Schema = mongoose.Schema;

configSchema = new Schema({
  name: String,
  value: String
}, {collection: 'config'});

Config = mongoose.model('Config', configSchema);

module.exports = {
  put: function(name, value, callback) {
    var conf, newConfig;
    conf = {
      name: name,
      value: value
    };

    newConfig = new Config(conf);

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
};