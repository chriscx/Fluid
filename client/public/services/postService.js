angular.module('Blog').factory('PostService', function() {
  var create, remove, save;
  create = function(data) {
    return $.post('/blog/post/' + getSlug(data.title) + '.json', data, function() {
      return console.log('POST success');
    });
  };
  save = function(data) {
    var oldSlug;
    oldSlug = data.oldSlug;
    data.slug = getSlug(data.title);
    delete data.oldSlug;
    delete data["new"];
    delete data._id;
    delete data.__v;
    delete data.__proto__;
    console.log(data);
    console.log('/blog/post/' + oldSlug + '.json');
    return $.put('/blog/post/' + oldSlug + '.json', data, function() {
      return console.log('PUT success');
    });
  };
  return remove = function(data) {
    return $.del('/blog/post/' + getSlug(data.title) + '.json', function() {
      return console.log('DEL success');
    });
  };
});
