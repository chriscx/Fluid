var should, blog, user, mongoose, request;

mongoose  = require('mongoose');
should = require('should');
blog = require('../lib/blog');
user = require('../lib/user');
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

  it('should get index page', function(next) {
  	request('http://localhost:3333', function (err, res, body) {
  		res.statusCode.should.be.eql(200);
  		next();
  	});
  }),

  it('should get login page', function(next) {
  	request('http://localhost:3333/login', function (err, res, body) {
  		res.statusCode.should.be.eql(200);
  		next();
  	});
  }),

  it('should get admin page', function(next) {
  	request('http://localhost:3333/admin', function (err, res, body) {
  		res.statusCode.should.be.eql(200);
  		next();
  	});
  }),

  it('should get blog page', function(next) {
    request('http://localhost:3333/blog', function (err, res, body) {
      res.statusCode.should.be.eql(200);
      next();
    });
  }),

  it('should get blog post page', function(next) {

    var entry = { 
      title: "test-request-blog-post",
      author: "", 
      url: "test-request-blog-post",
      body: "",
      tags: [],
      category: '',
      comments: [],
      creationDate: new Date(),
      updateDate: new Date(),
      published: true
    };
    
    return blog.createEntry(entry, function(err, data) {
      if(err) {
        next(err);
      }
      
      request('http://localhost:3333/blog/post/test-request-blog-post', function (err, res, body) {
        res.statusCode.should.be.eql(200);
        blog.removeEntry(data._id, function(err, data) {
          next();
        });
      });
    });
  }),

  it('should get logout page', function(next) {
    request('http://localhost:3333/logout', function (err, res, body) {
      res.statusCode.should.be.eql(200);
      next();
    });
  }),

  it('should get error page', function(next) {
    request('http://localhost:3333/error/404', function (err, res, body) {
      res.statusCode.should.be.eql(200);
      next();
    });
  })

  // it('should post login page', function() {

  // })
});