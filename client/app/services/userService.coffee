angular.module('User').factory 'UserService', ($http, $location, $window, AuthenticationService) ->

  logIn: (username, password) ->
    $http.post '/login',
      username: username
      password: password

  signUp: (user) ->
    console.log user
    $http.post '/signup', user

  forgotPassword: (email) ->
    $http.post '/forgot', email: email

  resetPassword: (token, password) ->
    $http.post '/reset',
      token: token,
      password: password

  getUserData: (username)->
    $http.get '/data/user/' + username + '.json'

  updateUserData:(username, data) ->
    $http.put '/data/user/' + username + '.json', data
