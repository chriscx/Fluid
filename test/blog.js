var exec, should, blog, mongoose;

mongoose  = require('mongoose');
should = require('should');
blog = require('../src/blog');

describe("blog", function() {

  before(function() {
    if(!mongoose.connection.readyState){
      mongoose.connect('mongodb://localhost/fluiddb');
    }
  })

  after(function() {
    mongoose.disconnect();
  });

  it("save, get & delete an entry", function(next) {
    var entry = { 
      title: "This is a test entry",
      author: "root", 
      url: "this-is-a-test-entry",
      body: "This is me writing my first blog post",
      tags: [{name: 'tag'}],
      category: 'category',
      comments: [{body: "this is a comment", date: new Date()}],
      date: new Date(),
      published: true
    };
    
    return blog.createEntry(entry, function(err, data) {
      if(err) {
        console.log(err);
        return next(err);
      }
      // console.log('create: ' + data);
      blog.getEntry("This is a test entry", function(err, retrievedEntry) {
        if(err) {
          console.log(err);
          return next(err);
        }
        // console.log('get 1: ' + retrievedEntry);
        retrievedEntry[0].body.should.be.eql("This is me writing my first blog post");

        blog.removeEntry(retrievedEntry[0]._id, function(err, deletedEntry) {
          if(err) {
            console.log(err);
            return next(err);
          }
          // console.log('remove: ' + deletedEntry);
          blog.getEntry("This is a test entry", function(err, data) {
            if(err) {
              console.log(err);
              return next(err);
            }
            // console.log("get 2: " + data);
            data.should.be.empty;
            next();
          })
        });
      });
    });
  });

  it("edit an entry", function(next) {
    var entry = { 
      title: "This is a test entry 2",
      author: "root", 
      url: "this-is-a-test-entry",
      body: "This is me writing my first blog post",
      tags: [{name: 'tag'}],
      category: 'category',
      comments: [{body: "this is a comment", date: new Date()}],
      date: new Date(),
      published: true
    };
    
    return blog.createEntry(entry, function(err, data) {
      if(err) {
        console.log(err);
        return next(err);
      }
      // console.log('create: ' + data);
      blog.getEntry("This is a test entry 2", function(err, retrievedEntry) {
        if(err) {
          console.log(err);
          return next(err);
        }
        // console.log('get 1: ' + retrievedEntry);
        retrievedEntry[0].body.should.be.eql("This is me writing my first blog post");

        blog.editEntry(retrievedEntry[0]._id, {title: 'This is a modified entry 2'}, function(err, data) {

          blog.getEntry('This is a modified entry 2', function(err, data) {
            console.log(data);
            data[0].title.should.be.eql('This is a modified entry 2');
            blog.removeEntry(data[0]._id, function(err, deletedEntry) {
              if(err) {
                console.log(err);
                return next(err);
              }
              // console.log('remove: ' + deletedEntry);
              blog.getEntry("This is a modified entry", function(err, data) {
                if(err) {
                  console.log(err);
                  return next(err);
                }
                // console.log("get 2: " + data);
                data.should.be.empty;
                next();
              })
            });
          });
        });
      });
    });
  });

  // it("create, get & save a category", function(next) {

  // });

  // it("edit a category", function(next) {

  // });
});