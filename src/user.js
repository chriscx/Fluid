module.exports = {
  /*
  `save(login, callback)`
  ----------------------------
  
  Parameters
  `login`       user login as email format
  `password`    user password
  `callback` Contains an err as first argument 
             if any
  */

  create: function(login, password, callback) {
  },

  /*
  `remove(login, callback)`
  ----------------------------
  
  Parameters
  `login`       user login as email format
  `callback` Contains an err as first argument 
             if any
  */

  remove: function(login, callback) {

  },

    /*
  `check(login, callback)`
  ----------------------------
  
  Parameters
  `login`       user login as integer
  `password`    user password
  `callback` Contains an err as first argument 
             if any

  returns bool if passwords match
  */

  check: function(login, password, callback) {

  }
};
