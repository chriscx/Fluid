var mongoose;

mongoose  = require('mongoose');

mongoose.connect('mongodb://localhost/fluiddb');

var Schema = mongoose.Schema;

var userSchema = new Schema({
  firstname,
  lastname,
  email,
  password,
  createDate: { type: Date, default: Date.now },
});

var User = mongoose.model('User', userSchema);

module.exports = {
  /*
  `save(info, callback)`
  ----------------------------
  
  Parameters
  `info`       JSON object with properties of user (see userSchema)
  `callback` Contains an err as first argument 
             if any
  */

  create: function(info, callback) {
    var newUser = new User(info);
    newUser.save(function(err, newUser, numberAffected) {
      if(err) {
        callback(err);
      }
      else {
        callback(null, newUser);
      }
    })
  },

  /*
  `remove(id, callback)`
  ----------------------------
  
  Parameters
  `id`       user id as email format
  `callback` Contains an err as first argument 
             if any
  */

  remove: function(id, callback) {
    User.remove({'_id' : id}, function (err, data) {
      if (err) {
        callback(err);
      }
        callback(null, data);
    }).remove();
  },



    /*
  `checkPassword(login, callback)`
  ----------------------------
  
  Parameters
  `login`       user login as integer
  `password`    user password
  `callback` Contains an err as first argument 
             if any

  returns bool if passwords match
  */

  checkPassword: function(email, password, callback) {
    User.find({'email' : email}, function (err, data) {
      if (err) {
        callback(err);
      }
      else {
        if(data.password == password) {
          callback(null, true);
        } else {
          callback(null, false);
        }
      }
    })
  }
};
