angular.module('Blog').factory('CategoryService', function() {
  var create, remove, save;
  remove = function(data) {
    return $.del('/blog/category/' + data.name + '.json', function() {
      return console.log('PUT success');
    });
  };
  create = function(data) {
    return $.post('/blog/category/' + data.name + '.json', data, function() {
      return console.log('POST success');
    });
  };
  return save = function(data) {
    return $.put('/blog/category/' + data.name + '.json', data, function() {
      return console.log('PUT success');
    });
  };
});
