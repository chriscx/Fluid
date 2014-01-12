var exec, should, user, mongoose, connexion;

mongoose  = require('mongoose');
mongoose.connect('mongodb://localhost/fluiddb');
should = require('should');
user = require('../lib/user');

describe("user", function() {

  before(function() {
    if(!mongoose.connection.readyState){
      mongoose.connect('mongodb://localhost/fluiddb_test');
    }
  })

  after(function() {
    mongoose.disconnect();
  });

  it("create & delete a user", function(next) {
    var newUser = { 
      firstname: "firstname",
      lastname: "lastname",
      email: "firstname.lastname@fluid.org",
      password: "password",
      signupDate: new Date(),
    };

    return user.create(newUser, function(err, createdUser) {
      if(err) {
        return next(err);
      }
      user.get(createdUser._id, function(err, retrievedUser) {
        if(err) {
          return next(err);
        }
        retrievedUser[0].email.should.eql("firstname.lastname@fluid.org");
        var id = retrievedUser[0]._id;
        user.remove(id, function(err, deletedUser) {
          if(err) {
            return next(err);
          }
          user.get(id, function(err, data) {
            if(err){
              return next(err);
            }
            data.should.be.empty;
            next();
          })
        })
      });
    });
  });

  it("checks the password", function(next) {
    var newUser = { 
      firstname: "firstname",
      lastname: "lastname",
      email: "firstname.lastname@fluid.org",
      password: "password",
      signupDate: new Date(),
    };

    return user.create(newUser, function(err, createdUser) {
      if(err) {
        return next(err);
      }
      user.checkPassword("firstname.lastname@fluid.org", "password", function(err, res) {
        if(err) {
          return next(err);
        }
        res.check.should.be.ok;
        user.get(createdUser._id, function(err, retrievedUser) {
          if(err) {
            return next(err);
          }
          retrievedUser[0].email.should.eql("firstname.lastname@fluid.org");
          var id = retrievedUser[0]._id;
          user.remove(id, function(err, deletedUser) {
            if(err) {
              return next(err);
            }
            user.get(id, function(err, data) {
              if(err){
                return next(err);
              }
              data.should.be.empty;
              next();
            })
          })
        });
      });
    });
  });
});