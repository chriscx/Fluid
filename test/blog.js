var exec, should, blog;

exec = require('child_process').exec;

should = require('should');

blog = require('../src/blog');

describe("blog", function() {
  it("save, get & delete an entry", function(next) {
    var entry = { 
      title: "This is a test entry",
      author: "root", 
      url: "this-is-a-test-entry",
      body: "This is me writing my first blog post",
      comments: [{body: "this is a comment", date: new Date()}],
      date: new Date(),
      published: true
    };
    
    return blog.createEntry(entry, function(err, data) {
      if(err) {
        console.log(err);
        return next(err);
      }
      console.log('create: ' + data);
      var id;
      blog.getEntry("This is a test entry", function(err, retrievedEntry) {
        if(err) {
          console.log(err);
          return next(err);
        }
        console.log('get 1: ' + retrievedEntry);
        retrievedEntry[0].body.should.be.eql("This is me writing my first blog post");
        id = retrievedEntry[0]._id;

        blog.removeEntry(id, function(err, deletedEntry) {
          if(err) {
            console.log(err);
            return next(err);
          }
          console.log('remove: ' + deletedEntry);
          blog.getEntry("This is a test entry", function(err, data) {
            if(err) {
              console.log(err);
              return next(err);
            }
            console.log("get 2: " + data);
            data.should.be.empty;
            next();
          })
        });
      });
    });
  });
});