angular.module('User').factory('UserService', function($http) {
  return {
    logIn: function(username, password) {
      return $http.post('/login', {
        username: username,
        password: password
      });
    },
    signUp: function(username, password, email, firstname, lastname, country) {
      return $http.post('/signup', {
        username: username,
        password: password,
        email: email,
        firstname: firstname,
        lastname: lastname,
        country: country
      });
    },
    getUserData: function(username, onSuccess) {
      return $http.get('/data/user/' + username + '.json').success(function(data) {
        return onSuccess(data);
      }).error(function(data, status, headers, config) {
        console.log(status);
        console.log(headers);
        return console.log(config);
      });
    },
    updateUserData: function(username, data, onSuccess) {
      return $http.put('/data/user/' + username + '.json', data).success(function(data) {
        return onSuccess(data);
      }).error(function(data, status, headers, config) {
        console.log(status);
        console.log(headers);
        return console.log(config);
      });
    },
    getPlaylistList: function(username, onSuccess) {
      return $http.get('/data/user/' + username + '/playlists.json').success(function(data) {
        return onSuccess(data);
      }).error(function(data, status, headers, config) {
        console.log(status);
        console.log(headers);
        return console.log(config);
      });
    },
    getPlaylist: function(username, id, onSuccess) {
      return $http.get('/data/user/' + username + '/p/' + id + '.json').success(function(data) {
        return onSuccess(data);
      }).error(function(data, status, headers, config) {
        console.log(status);
        console.log(headers);
        return console.log(config);
      });
    },
    updatePlaylist: function(username, id, data, onSuccess) {
      return $http.put('/data/user/' + username + '/p/' + id + '.json', data).success(function(data) {
        return onSuccess(data);
      }).error(function(data, status, headers, config) {
        console.log(status);
        console.log(headers);
        return console.log(config);
      });
    },
    deletePlaylist: function(username, id, onSuccess) {
      return $http["delete"]('/data/user/' + username + '/p/' + id + '.json').success(function(data) {
        return onSuccess(data);
      }).error(function(data, status, headers, config) {
        console.log(status);
        console.log(headers);
        return console.log(config);
      });
    }
  };
});
