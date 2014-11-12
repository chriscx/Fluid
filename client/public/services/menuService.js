angular.module('Blog').factory('MenuService', function($http) {
  return {
    getList: function() {
      return $http.get('/data/menu.json');
    },
    get: function(id) {
      return $http.get('/data/menu/' + id + '.json');
    },
    remove: function(id) {
      return $http["delete"]('/data/menu/' + id + '.json');
    },
    create: function(id) {
      return $http.post('/data/menu/', id);
    },
    save: function(id, data) {
      return $http.put('/data/menu/' + id + '.json', data);
    }
  };
});
