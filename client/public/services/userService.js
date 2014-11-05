angular.module('User').factory('UserService', function($http) {
  return {
    logIn: function(username, password) {
      return $http.post('/login', {
        username: username,
        password: password
      });
    },
    signUp: function(username, password, email, firstname, lastname) {
      console.log({
        username: username,
        password: password,
        email: email,
        firstname: firstname,
        lastname: lastname,
        country: country
      });
      return $http.post('/signup', {
        username: username,
        password: password,
        email: email,
        firstname: firstname,
        lastname: lastname,
        country: country
      });
    },
    forgotPassword: function(email) {
      return $http.post('/forgot', {
        email: email
      });
    },
    resetPassword: function(hash, password) {
      return $http.post('/reset', {
        hash: hash,
        password: password
      });
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
