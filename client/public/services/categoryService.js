angular.module('Blog').factory('CategoryService', function($http) {
  return {
    getList: function() {
      return $http.get('/data/blog/categories.json');
    },
    get: function(id) {
      return $http.get('/data/blog/category/' + id + '.json');
    },
    remove: function(id) {
      return $http["delete"]('/data/blog/category/' + id + '.json');
    },
    create: function(id) {
      return $http.post('/data/blog/category/', id);
    },
    save: function(id, data) {
      return $http.put('/data/blog/category/' + id + '.json', data);
    }
  };
});
