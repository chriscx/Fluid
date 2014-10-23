angular.module('Page').factory('PageService', function() {
  var create, remove, save;
  remove = function() {
    return $.del('/page/' + route + '.json', function() {
      return console.log('PUT success');
    });
  };
  create = function(data) {
    return $.post('/page/' + data.route + '.json', data, function() {
      return console.log('POST success');
    });
  };
  return save = function(data) {
    var oldRoute;
    oldRoute = data.oldRoute;
    delete data.oldRoute;
    delete data["new"];
    delete data._id;
    delete data.__v;
    delete data.__proto__;
    return $.put('/page/' + oldRoute + '.json', data, function() {
      return console.log('PUT success');
    });
  };
});
