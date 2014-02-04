var should, blog, user, mongoose, request, config;

mongoose  = require('mongoose');
should = require('should');
blog = require('../lib/blog');
config = require('../config');
user = require('../lib/user');
eventEmitter = require('events').EventEmitter;
request = require('request');

describe("app", function() {

  before(function(next) {
    if(!mongoose.connection.readyState){
      mongoose.connect('mongodb://' + config.mongo.development.host + '/' + config.mongo.development.db, null, function() {
        next();
      });
    }
    else {

      // in case connection is on another db, disconnect to change
      // TODO see if can change db without disconnecting first.
      mongoose.disconnect(function() {
        mongoose.connect('mongodb://' + config.mongo.development.host + '/' + config.mongo.development.db, null, function() {
          next();
        });
      });
    }
  });

  after(function(next) {
    mongoose.disconnect(function() {
      next();
    });
  });

  it('should get index page', function(next) {
  	request('http://localhost:3333/', function (err, res, body) {
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

  // it('should post login page', function() {

  // })

  it('should get logout page', function(next) {
    request('http://localhost:3333/logout', function (err, res, body) {
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

   // it('should get blog entries by pagination', function() {

  // }) 

  // it('should get blog entries by tag', function() {

  // })

  // it('should get blog entries by category', function() {

  // })

  it('should post new blog entry', function(next) {
    return request.post({
      uri: 'http://localhost:3333/blog/post/create',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        title: "post-blog-entry-test"
      })
    }, function(err, res, body) {

      res.statusCode.should.be.eql(200);
      JSON.parse(res.body).newEntry.should.not.be.empty;

      blog.getEntry({title: "post-blog-entry-test"}, function(err, data) {

        data[0].title.should.be.eql("post-blog-entry-test");
        blog.removeEntry(data[0]._id, function() {
          next();
        });
      });
    });
  })

  // it('should del blog entry', function() {

  //   var entry = {

  //   }
  //   return blog.createEntry(entry, function(err, data) {
  //     request.del({
  //       uri: 'http://localhost:3333/blog/post/' + data._id,
  //       headers: {
  //         'content-type': 'application/json'
  //       },
  //       body: ""
  //     }, function(err, res, body) {

  //       res.statusCode.should.be.eql(200);

  //       blog.getEntry({_id: data._id}, function(err, entry) {

  //         next();
  //       })
  //     });
  //   })
  // })

  // it('should put blog entry', function() {

  // })


  it('should get error page', function(next) {
    request('http://localhost:3333/error/404', function (err, res, body) {
      res.statusCode.should.be.eql(200);
      next();
    });
  })
});