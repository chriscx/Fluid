var should, blog, mongoose;

mongoose  = require('mongoose');
should = require('should');
config = require('../lib/config');
eventEmitter = require('events').EventEmitter;

describe("config", function() {

  before(function() {
    if(!mongoose.connection.readyState){
      mongoose.connect('mongodb://localhost/fluiddb_test');
    }
  });

  after(function() {
    mongoose.disconnect();
  });

  it("should create, get & delete a config", function(next) {
  	config.put('test', 'testValue', function(err, data) {
  	  if(err) {
  	  	next(err);
  	  }
  	  data.name.should.be.eql('test');
  	  data.value.should.be.eql('testValue');

  	  config.get('test', function(err, nextData) {
  	  	if(err) {
  	  		next(err);
  	  	}
        nextData.should.not.be.empty;
  		nextData[0].name.should.be.eql('test');
  		nextData[0].value.should.be.eql('testValue');

  		config.del('test', function(err) {
  	      if(err) {
  	      	next(err);
  	      }

  		  config.get('test', function(err, delData) {
  		  	if(err) {
  		  		next(err);
  		  	}
  		    delData.should.be.empty;
  		    next();
  		  });
  		});
  	  });
  	});
  });
});