var should, blog, user, mongoose, request;

mongoose  = require('mongoose');
should = require('should');
blog = require('../lib/blog');
user = require('../lib/user')
eventEmitter = require('events').EventEmitter;
request = require('request');

describe("app", function() {

  before(function() {
    if(!mongoose.connection.readyState){
      mongoose.connect('mongodb://localhost/fluiddb_test');
    }
  });

  after(function() {
    mongoose.disconnect();
  });

  it('should get login page', function(next) {
  	request('http://localhost:3333/login', function (err, res, body) {
  		res.statusCode.should.be.eql(200);
  		next();
  	});
  })

  // it('should post login page', function() {

  // })
});