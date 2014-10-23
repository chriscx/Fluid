angular.module('User').factory 'UserService', ($http) ->
  logIn: (username, password) ->
    $http.post '/login',
      username: username
      password: password

  signUp: (username, password, email, firstname, lastname, country) ->
    $http.post '/signup',
      username: username
      password: password
      email: email
      firstname: firstname
      lastname: lastname
      country: country


  getUserData: (username, onSuccess)->
    $http.get('/data/user/' + username + '.json').success((data) ->
      onSuccess data
    ).error((data, status, headers, config) ->
      console.log status
      console.log headers
      console.log config
    )

  updateUserData:(username, data, onSuccess) ->
    $http.put('/data/user/' + username + '.json', data).success((data) ->
      onSuccess data
    ).error((data, status, headers, config)->
      console.log status
      console.log headers
      console.log config
    )

  getPlaylistList: (username, onSuccess) ->
    $http.get('/data/user/' + username + '/playlists.json').success((data) ->
      onSuccess data
    ).error((data, status, headers, config) ->
      console.log status
      console.log headers
      console.log config
    )

  getPlaylist: (username, id, onSuccess) ->
    $http.get('/data/user/' + username + '/p/' + id + '.json').success((data) ->
      onSuccess data
    ).error((data, status, headers, config) ->
      console.log status
      console.log headers
      console.log config
    )

  updatePlaylist: (username, id, data, onSuccess) ->
    $http.put('/data/user/' + username + '/p/' + id + '.json', data).success((data) ->
      onSuccess data
    ).error((data, status, headers, config) ->
      console.log status
      console.log headers
      console.log config
    )

  deletePlaylist: (username, id, onSuccess) ->
    $http.delete('/data/user/' + username + '/p/' + id + '.json').success((data) ->
      onSuccess data
    ).error((data, status, headers, config) ->
      console.log status
      console.log headers
      console.log config
    )
