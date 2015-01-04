angular.module('User').factory('UserService', function($http, $location, $window, AuthenticationService) {
  return {
    logIn: function(username, password) {
      return $http.post('/login', {
        username: username,
        password: password
      });
    },
    signUp: function(user) {
      console.log(user);
      return $http.post('/signup', user);
    },
    forgotPassword: function(email) {
      return $http.post('/forgot', {
        email: email
      });
    },
    resetPassword: function(token, password) {
      return $http.post('/reset', {
        token: token,
        password: password
      });
    },
    resetAuth: function() {
      AuthenticationService.isLogged = false;
      delete $window.sessionStorage.token;
      delete $window.sessionStorage.username;
      delete $window.sessionStorage.firstname;
      delete $window.sessionStorage.lastname;
      return $location.path = '/login';
    },
    getUserData: function(username) {
      return $http.get('/data/user/' + username + '.json');
    },
    updateUserData: function(username, data) {
      return $http.put('/data/user/' + username + '.json', data);
    },
    getPlaylistList: function(username) {
      return $http.get('/data/user/' + username + '/playlists.json');
    },
    getPlaylist: function(username, id) {
      return $http.get('/data/user/' + username + '/p/' + id + '.json');
    },
    updatePlaylist: function(username, id, data) {
      return $http.put('/data/user/' + username + '/p/' + id + '.json', data);
    },
    deletePlaylist: function(username, id) {
      return $http["delete"]('/data/user/' + username + '/p/' + id + '.json');
    }
  };
});
