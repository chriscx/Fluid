angular.module('User').factory 'UserService', ($http) ->

  logIn: (username, password) ->
    $http.post '/login',
      username: username
      password: password

  signUp: (user) ->
    console.log user
    $http.post '/signup', user

  forgotPassword: (email) ->
    $http.post '/forgot', email: email

  resetPassword: (hash, password) ->
    $http.post '/reset',
      hash: hash,
      password: password

  getUserData: (username)->
    $http.get '/data/user/' + username + '.json'

  updateUserData:(username, data) ->
    $http.put '/data/user/' + username + '.json', data

  getPlaylistList: (username) ->
    $http.get '/data/user/' + username + '/playlists.json'

  getPlaylist: (username, id) ->
    $http.get '/data/user/' + username + '/p/' + id + '.json'

  updatePlaylist: (username, id, data) ->
    $http.put '/data/user/' + username + '/p/' + id + '.json', data

  deletePlaylist: (username, id) ->
    $http.delete '/data/user/' + username + '/p/' + id + '.json'
