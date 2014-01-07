var exec, should, blog;

exec = require('child_process').exec;

should = require('should');

blog = require('../src/blog');

describe("blog", function() {
  it("get an entry", function(next) {
    return blog.getEntry('75b0efc7167511df8049c2df1f033648', function(err, data) {
      if(err) {
        return next(err);
      }
      console.log(data);
      var entry = JSON.parse(data);
      entry._id.should.be.eql('75b0efc7167511df8049c2df1f033648');
      next();
    });
  });
});