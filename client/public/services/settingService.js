angular.module('Blog').factory('SettingService', function($http) {
  return {
    getList: function() {
      return $http.get('/data/settings.json');
    },
    get: function(id) {
      return $http.get('/data/settings/' + id + '.json');
    },
    create: function(data) {
      return $http.post('/data/settings/', data);
    },
    save: function(id, data) {
      return $http.put('/data/settings/' + id + '.json', data);
    },
    remove: function(id) {
      return $http["delete"]('/data/settings/' + id + '.json');
    }
  };
});
