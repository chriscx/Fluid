angular.module('Page').factory('PageService', function($http) {
  return {
    getList: function() {
      return $http.get('/data/pages.json');
    },
    get: function(route) {
      return $http.get('/data/page/' + route + '.json');
    },
    remove: function(route) {
      return $http["delete"]('/data/page/' + route + '.json');
    },
    create: function(data) {
      return $http.post('/data/page/', data);
    },
    save: function(route, data) {
      return $http.put('/data/page/' + route + '.json', data);
    }
  };
});
