angular.module('Blog').factory('PostService', function($http) {
  return {
    getList: function() {
      return $http.get('/data/blog/posts.json');
    },
    getBySlice: function(s, l) {
      return $http.get('/data/blog/post/' + s + '/' + l + '/posts.json');
    },
    get: function(id, render) {
      if (render === true) {
        return $http.get('/data/blog/post/render/' + id + '.json');
      } else {
        return $http.get('/data/blog/post/' + id + '.json');
      }
    },
    create: function(data) {
      return $http.post('/data/blog/post/', data);
    },
    save: function(id, data) {
      return $http.put('/data/blog/post/' + id + '.json', data);
    },
    remove: function(id) {
      return $http["delete"]('/data/blog/post/' + id + '.json');
    }
  };
});
