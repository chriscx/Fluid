var exec, should, user, mongoose, connexion;

mongoose  = require('mongoose');
mongoose.connect('mongodb://localhost/fluiddb');
should = require('should');
user = require('../src/user');

describe("user", function() {

  before(function() {
    if(!mongoose.connection.readyState){
      mongoose.connect('mongodb://localhost/fluiddb');
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
});