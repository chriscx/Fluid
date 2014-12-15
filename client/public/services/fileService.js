angular.module('User').factory('FileService', function($http, $location, $window, AuthenticationService) {
  return {
    getList: function() {
      return $http.get('/data/files.json');
    },
    removeFile: function(name) {
      return $http["delete"]('/data/files/' + name);
    }
  };
});
