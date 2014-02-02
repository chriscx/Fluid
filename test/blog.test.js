var should, blog, mongoose, eventEmitter;

mongoose  = require('mongoose');
should = require('should');
blog = require('../lib/blog');
eventEmitter = require('events').EventEmitter;

describe("blog", function() {

  before(function(next) {
    if(!mongoose.connection.readyState){
      mongoose.connect('mongodb://localhost/fluiddb_test', null, function() {
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
    blog.should.have.properties('getEntry');
    blog.should.have.properties('createEntry');
    blog.should.have.properties('getEntries');
    blog.should.have.properties('removeEntry');
    blog.should.have.properties('editEntry');
    blog.should.have.properties('getCategory');
    blog.should.have.properties('getCategories');
    blog.should.have.properties('removeCategory');
    blog.should.have.properties('editCategory');
    blog.should.have.properties('createCategory');
    next();
  })

  /*
  
  */
  it("should create an entry", function(next) {
    var entry = { 
      title: "test1",
      author: "root", 
      url: "this-is-a-test-entry",
      body: "This is me writing my first blog post",
      tags: [{name: 'tag'}],
      category: 'category',
      comments: [{body: "this is a comment", date: new Date()}],
      creationDate: new Date(),
      updateDate: new Date(),
      published: true
    };
    
    return blog.createEntry(entry, function(err, data) {
      should.not.exist(err);
      if(err) {
        err.should.not.be.empty;
        console.log(err);
        return next(err);
      }

      data.body.should.be.eql("This is me writing my first blog post");

      blog.removeEntry(data._id, function(err, deletedEntry) {
        should.not.exist(err);
        if(err) {
          console.log(err);
          return next(err);
        }

        next();
      });
    });
  });

  /*
  
  */
  it("should get an entry", function(next) {
    var entry = { 
      title: "test2",
      author: "root", 
      url: "this-is-a-test-entry",
      body: "This is me writing my first blog post",
      tags: [{name: 'tag'}],
      category: 'category',
      comments: [{body: "this is a comment", date: new Date()}],
      creationDate: new Date(),
      updateDate: new Date(),
      published: true
    };
    
    return blog.createEntry(entry, function(err, data) {
      should.not.exist(err);
      if(err) {
        console.log(err);
        return next(err);
      }

      blog.getEntry({title: "test2"}, function(err, retrievedEntry) {
        should.not.exist(err);
        if(err) {
          console.log(err);
          return next(err);
        }

        retrievedEntry[0].body.should.be.eql("This is me writing my first blog post");

        blog.removeEntry(retrievedEntry[0]._id, function(err, deletedEntry) {
          should.not.exist(err);
          if(err) {
            console.log(err);
            return next(err);
          }
          next();
        });
      });
    });
  });

  /*
  
  */
  it("should delete an entry", function(next) {
    var entry = { 
      title: "test3",
      author: "root", 
      url: "this-is-a-test-entry",
      body: "This is me writing my first blog post",
      tags: [{name: 'tag'}],
      category: 'category',
      comments: [{body: "this is a comment", date: new Date()}],
      creationDate: new Date(),
      updateDate: new Date(),
      published: true
    };
    
    return blog.createEntry(entry, function(err, data) {
      should.not.exist(err);
      if(err) {
        console.log(err);
        return next(err);
      }

      blog.removeEntry(data._id, function(err, deletedEntry) {
        should.not.exist(err);
        if(err) {
          console.log(err);
          return next(err);
        }

        blog.getEntry({title: "test3"}, function(err, data) {
          should.not.exist(err);
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

  /*
  
  */
  it("should edit an entry", function(next) {
    var entry = { 
      title: "This is a test entry 2",
      author: "root", 
      url: "this-is-a-test-entry",
      body: "This is me writing my first blog post",
      tags: [{name: 'tag'}],
      category: 'category',
      comments: [{body: "this is a comment", date: new Date()}],
      creationDate: new Date(),
      updateDate: new Date(),
      published: true
    };
    
    return blog.createEntry(entry, function(err, data) {
      should.not.exist(err);
      if(err) {
        console.log(err);
        return next(err);
      }

      blog.getEntry({title: "This is a test entry 2"}, function(err, retrievedEntry) {
        should.not.exist(err);
        if(err) {
          console.log(err);
          return next(err);
        }

        retrievedEntry[0].body.should.be.eql("This is me writing my first blog post");

        blog.editEntry(retrievedEntry[0]._id, {title: 'This is a modified entry 2'}, function(err, data) {

          blog.getEntry({title: 'This is a modified entry 2'}, function(err, data) {
            data[0].title.should.be.eql('This is a modified entry 2');
            blog.removeEntry(data[0]._id, function(err, deletedEntry) {
              should.not.exist(err);
              if(err) {
                console.log(err);
                return next(err);
              }

              blog.getEntry({title: "This is a modified entry"}, function(err, data) {
                should.not.exist(err);
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

  /*
  
  */
  it("should get, count entries & count entry pages", function(next) {
    // TODO check dates are desc and pagination works
    var limit = 5, skip = 0, j, chainEvent = new eventEmitter();

    chainEvent.on("ready", function() {
      blog.getEntries(limit, skip, function(err, data) {
        should.not.exist(err);
        if(err) {
          next(err);
        }

        for(j = 0; j < limit; j++) {
          data[j].title.should.be.eql('entry ' + (20 - j));
        }

        blog.countEntries(function(err, count) {
          if(err) {
            next(err);
          }
  
          count.should.be.eql(20);

          blog.countPages(5, function(err, count) {
            if(err) {
              next(err);
            }
    
            count.should.be.eql(4);

            chainEvent.emit("clean");
          });
        });
      });
    });

    chainEvent.on("clean", function() {
      limit = 20, skip = 0;
      blog.getEntries(limit, skip, function(err, data) {
        should.not.exist(err);
        should.exist(data);
        if(err) {
          next(err);
        }
        for(j = 0; j < limit; j++) {
          blog.removeEntry(data[j]._id, function(err, removedEntry) {
            should.not.exist(err);
            if(err) {
              next(err);
            }
          })
        }
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
        creationDate: new Date(new Date().getTime() + (i * (24 * 60 * 60 * 1000))),
        updateDate: null,
        published: true
      };
      if(i < 20)
        blog.createEntry(entry, function(err, data) {});
    }
    blog.createEntry(entry, function(err) {
      chainEvent.emit('ready');
    })
  });
  
  /*
  
  */
  it("should create a category", function(next) {
    var category = { 
      name: 'category 1'
    };
    
    return blog.createCategory(category, function(err, data) {
      should.not.exist(err);
      if(err) {
        console.log(err);
        return next(err);
      }

      data.name.should.be.eql("category 1");

      blog.removeCategory(data._id, function(err, deletedEntry) {
        should.not.exist(err);
        if(err) {
          console.log(err);
          return next(err);
        }

        next();
      });
    });
  });

  /*
  
  */
  it("should get categories", function(next) {
    var category = { 
      name: 'category 3'
    };
    
    return blog.createCategory(category, function(err, data) {
      should.not.exist(err);
      if(err) {
        console.log(err);
        return next(err);
      }

      blog.getCategories(function(err, data) {
        should.not.exist(err);
        if(err) {
          console.log(err);
          return next(err);
        }

        data.should.not.be.empty;

        for(var i = 0; i < data.length; i++) {
          if(data[i].name === "category 3") {
            blog.removeCategory(data[i]._id, function(err, data) {
              should.not.exist(err);
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

  /*
  
  */
  it("should delete a category", function(next) {
    var category = {
      name: 'category 2'
    };
    
    return blog.createCategory(category, function(err, data) {
      should.not.exist(err);
      if(err) {
        console.log(err);
        return next(err);
      }

      blog.removeCategory(data._id, function(err, deletedEntry) {
        should.not.exist(err);
        if(err) {
          console.log(err);
          return next(err);
        }

        blog.getCategories(function(err, data) {
          should.not.exist(err);
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

  /*
  
  */
  it("should get a category", function(next) {
    var category = {
      name: 'category 4'
    };
    
    return blog.createCategory(category, function(err, data) {
      should.not.exist(err);
      if(err) {
        console.log(err);
        return next(err);
      }

      blog.getCategory(data._id, function(err, data) {
        should.not.exist(err);
        if(err) {
          next(err);
        }

        data[0].name.should.be.eql('category 4');

        blog.removeCategory(data[0]._id, function(err, deletedEntry) {
          should.not.exist(err);
          if(err) {
            console.log(err);
            return next(err);
          }

          blog.getCategory(deletedEntry._id, function(err, data) {
            should.not.exist(err);
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

  /*
  
  */
  it("should edit a category", function(next) {
    var category = {
      name: 'category 5'
    };
    
    return blog.createCategory(category, function(err, data) {
      should.not.exist(err);
      if(err) {
        console.log(err);
        return next(err);
      }

      var id = data._id;

      blog.editCategory(id, {name: "mod category 5"}, function(err, data) {
        should.not.exist(err);
        if(err) {
          console.log(err);
          return next(err);
        }

        blog.getCategory(id, function(err, data) {
          should.not.exist(err);
          if(err) {
            console.log(err);
            return next(err);
          }

          data[0].name.should.be.eql('mod category 5');

          blog.removeCategory(data[0]._id, function(err, deletedEntry) {
            should.not.exist(err);
            if(err) {
              console.log(err);
              return next(err);
            }

            blog.getCategory(deletedEntry._id, function(err, data) {
              should.not.exist(err);
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