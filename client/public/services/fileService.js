angular.module('User').factory('FileService', function($http, $location, $window) {
  return {
    getList: function() {
      return $http.get('/data/files.json');
    },
    remove: function(id) {
      return $http["delete"]('/data/files/' + id);
    }
  };
});
