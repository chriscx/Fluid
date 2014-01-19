var exec, should, blog, mongoose;

mongoose  = require('mongoose');
should = require('should');
blog = require('../lib/blog');
eventEmitter = require('events').EventEmitter;

describe("blog", function() {

  before(function() {
    if(!mongoose.connection.readyState){
      mongoose.connect('mongodb://localhost/fluiddb_test');
    }
  });

  after(function() {
    mongoose.disconnect();
  });

  it("should create an entry", function(next) {
    var entry = { 
      title: "test1",
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

      data.body.should.be.eql("This is me writing my first blog post");

      blog.removeEntry(data._id, function(err, deletedEntry) {
        if(err) {
          console.log(err);
          return next(err);
        }

        next();
      });
    });
  });

  it("should get an entry", function(next) {
    var entry = { 
      title: "test2",
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

      blog.getEntry("test2", function(err, retrievedEntry) {
        if(err) {
          console.log(err);
          return next(err);
        }

        retrievedEntry[0].body.should.be.eql("This is me writing my first blog post");

        blog.removeEntry(retrievedEntry[0]._id, function(err, deletedEntry) {
          if(err) {
            console.log(err);
            return next(err);
          }
          next();
        });
      });
    });
  });

  it("should delete an entry", function(next) {
    var entry = { 
      title: "test3",
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

      blog.removeEntry(data._id, function(err, deletedEntry) {
        if(err) {
          console.log(err);
          return next(err);
        }

        blog.getEntry("test3", function(err, data) {
          if(err) {
            console.log(err);
            return next(err);
          }

          data.should.be.empty;
          next();
        })
      });
    });
  });

  it("should edit an entry", function(next) {
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

      blog.getEntry("This is a test entry 2", function(err, retrievedEntry) {
        if(err) {
          console.log(err);
          return next(err);
        }

        retrievedEntry[0].body.should.be.eql("This is me writing my first blog post");

        blog.editEntry(retrievedEntry[0]._id, {title: 'This is a modified entry 2'}, function(err, data) {

          blog.getEntry('This is a modified entry 2', function(err, data) {
            data[0].title.should.be.eql('This is a modified entry 2');
            blog.removeEntry(data[0]._id, function(err, deletedEntry) {
              if(err) {
                console.log(err);
                return next(err);
              }

              blog.getEntry("This is a modified entry", function(err, data) {
                if(err) {
                  console.log(err);
                  return next(err);
                }

                data.should.be.empty;
                next();
              })
            });
          });
        });
      });
    });
  });

  it("should get entries", function(next) {
    // TODO check dates are desc and pagination works
    var limit = 5, skip = 0, j, chainEvent = new eventEmitter();

    chainEvent.on("ready", function() {
      blog.getEntries(limit, skip, function(err, data) {
        if(err) {
          next(err);
        }

        for(j = 0; j < limit; j++) {
          data[j].title.should.be.eql('entry ' + (20 - j));
        }
        console.log("clean");
        chainEvent.emit("clean");
      });
    });

    limit = 20, skip = 0;

    chainEvent.on("clean", function() {
      blog.getEntries(limit, skip, function(err, data) {
        if(err) {
          next(err);
        }

        for(j = 0; j < limit; j++) {
          blog.removeEntry(data[j]._id, function(err, removedEntry) {
            if(err) {
              next(err);
            }
          })
        }
        console.log("done");
        next();
      })
    });

    var entry;

    for(var i = 1; i < 21; i++) {
      entry = { 
        title: "entry " + i,
        author: "root", 
        url: "this-is-a-test-entry",
        body: "This is me writing my first blog post",
        tags: [{name: 'tag'}],
        category: 'category',
        comments: [{body: "this is a comment", date: new Date()}],
        date: new Date(new Date().getTime() + (i * (24 * 60 * 60 * 1000))),
        published: true
      };
      console.log(i + ': ' + entry.title);
      if(i < 20)
        blog.createEntry(entry, function(err, data) {});
    }
    blog.createEntry(entry, function(err) {
      chainEvent.emit('ready');
    })
  });

  it("should create a category", function(next) {
    var category = { 
      name: 'category 1'
    };
    
    return blog.createCategory(category, function(err, data) {
      if(err) {
        console.log(err);
        return next(err);
      }

      data.name.should.be.eql("category 1");

      blog.removeCategory(data._id, function(err, deletedEntry) {
        if(err) {
          console.log(err);
          return next(err);
        }

        next();
      });
    });
  });

  it("should get categories", function(next) {
    var category = { 
      name: 'category 3'
    };
    
    return blog.createCategory(category, function(err, data) {
      if(err) {
        console.log(err);
        return next(err);
      }

      blog.getCategories(function(err, data) {
        if(err) {
          console.log(err);
          return next(err);
        }

        data.should.not.be.empty;

        for(var i = 0; i < data.length; i++) {
          if(data[i].name === "category 3") {
            blog.removeCategory(data[i]._id, function(err, data) {
              if(err) {
                next(err);
              }

              next();
            });
            break;
          }
        }
      });
    });
  });

  it("should delete a category", function(next) {
    var category = {
      name: 'category 2'
    };
    
    return blog.createCategory(category, function(err, data) {
      if(err) {
        console.log(err);
        return next(err);
      }

      blog.removeCategory(data._id, function(err, deletedEntry) {
        if(err) {
          console.log(err);
          return next(err);
        }

        blog.getCategories(function(err, data) {
          if(err) {
            console.log(err);
            return next(err);
          }

          for(var i = 0; i < data.length; i++) {
            data[i].name.should.not.be.eql('category 2');
          }

          next();
        })
      });
    });
  });

  it("should get a category", function(next) {
    var category = {
      name: 'category 4'
    };
    
    return blog.createCategory(category, function(err, data) {
      if(err) {
        console.log(err);
        return next(err);
      }

      blog.getCategory(data._id, function(err, data) {
        if(err) {
          next(err);
        }

        data[0].name.should.be.eql('category 4');

        blog.removeCategory(data[0]._id, function(err, deletedEntry) {
          if(err) {
            console.log(err);
            return next(err);
          }

          blog.getCategory(deletedEntry._id, function(err, data) {
            if(err) {
              console.log(err);
              return next(err);
            }

            next();
          })
        });
      });
    });
  });

  it("should edit a category", function(next) {
    var category = {
      name: 'category 5'
    };
    
    return blog.createCategory(category, function(err, data) {
      if(err) {
        console.log(err);
        return next(err);
      }

      var id = data._id;

      blog.editCategory(id, {name: "mod category 5"}, function(err, data) {
        if(err) {
          console.log(err);
          return next(err);
        }

        blog.getCategory(id, function(err, data) {
          if(err) {
            console.log(err);
            return next(err);
          }

          data[0].name.should.be.eql('mod category 5');

          blog.removeCategory(data[0]._id, function(err, deletedEntry) {
            if(err) {
              console.log(err);
              return next(err);
            }

            blog.getCategory(deletedEntry._id, function(err, data) {
              if(err) {
                console.log(err);
                return next(err);
              }

              next();
            })
          });
        });
      });
    });
  });
});