angular.module('Blog').factory('CategoryService', function($http) {
  return {
    getList: function() {
      return $http.get('/data/blog/categories.json');
    },
    get: function(name) {
      return $http.get('/data/blog/category/' + name + '.json');
    },
    remove: function(name) {
      return $http["delete"]('/data/blog/category/' + name + '.json');
    },
    create: function(data) {
      return $http.post('/data/blog/category/', data);
    },
    save: function(name, data) {
      return $http.put('/data/blog/category/' + name + '.json', data);
    }
  };
});
