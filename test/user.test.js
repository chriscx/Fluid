var should, user, mongoose, connexion, config;

mongoose  = require('mongoose');
config = require('../config');
should = require('should');
user = require('../lib/user');

describe("user", function() {

  before(function(next) {
    if(!mongoose.connection.readyState){
      mongoose.connect('mongodb://' + config.mongo.development.host + '/' + config.mongo.development.db, null, function() {
        next();
      });
    }
    else {
      next();
    }
  });

  after(function(next) {
    mongoose.disconnect(function() {
      next();
    });
  });

  it("should have the blog properties", function(next) {
    user.should.have.properties('get');
    user.should.have.properties('create');
    user.should.have.properties('remove');
    user.should.have.properties('checkPassword');
    next();
  })

  it("create & delete a user", function(next) {
    var newUser = { 
      firstname: "firstname",
      lastname: "lastname",
      email: "firstname.lastname@fluid.org",
      password: "password",
      signupDate: new Date(),
    };

    return user.create(newUser, function(err, createdUser) {
      should.not.exist(err);
      if(err) {
        return next(err);
      }
      user.get(createdUser._id, function(err, retrievedUser) {
        should.not.exist(err);
        if(err) {
          return next(err);
        }
        retrievedUser[0].email.should.eql("firstname.lastname@fluid.org");
        var id = retrievedUser[0]._id;
        user.remove(id, function(err, deletedUser) {
          should.not.exist(err);
          if(err) {
            return next(err);
          }
          user.get(id, function(err, data) {
            should.not.exist(err);
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
      should.not.exist(err);
      if(err) {
        return next(err);
      }
      user.checkPassword("firstname.lastname@fluid.org", "fakepassword", function(err, res) {
        should.not.exist(err);
        res.check.should.not.be.ok;

        user.checkPassword("fakeemail", "fakepassword", function(err, res) {
          should.exist(err);
          
          user.checkPassword("firstname.lastname@fluid.org", "password", function(err, res) {
            should.not.exist(err);
            if(err) {
              return next(err);
            }
            res.should.have.property('check');
            res.check.should.be.ok;
            user.get(createdUser._id, function(err, retrievedUser) {
              should.not.exist(err);
              if(err) {
                return next(err);
              }
              retrievedUser[0].email.should.eql("firstname.lastname@fluid.org");
              var id = retrievedUser[0]._id;
              user.remove(id, function(err, deletedUser) {
                should.not.exist(err);
                if(err) {
                  return next(err);
                }
                user.get(id, function(err, data) {
                  should.not.exist(err);
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
  });
});