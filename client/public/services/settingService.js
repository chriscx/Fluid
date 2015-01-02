angular.module('Blog').factory('SettingService', function($http) {
  return {
    get: function() {
      return $http.get('/data/settings.json');
    },
    create: function(data) {
      return $http.post('/data/settings.json', data);
    },
    save: function(data) {
      return $http.put('/data/settings.json', data);
    }
  };
});
