angular.module('Users').factory 'UserService', ($http, $q, User) ->

  genericErrorCallback: (response) ->
    console.log "error", response
    $q.reject(response)

  genericSuccessCallback = (response) -> new User response.data

  # userInfo is an object with username and password
  logInUser: (userInfo) ->
    $http.post('/login', userInfo).then(@genericSuccessCallback, @genericErrorCallback)

  # user is an object built with User factory
  signUpUser: (user) ->
    $http.post('/signup', user).then(@genericSuccessCallback, @genericErrorCallback)

  # will send an email with procedure to
  forgotUserPassword: (email) ->
    $http.post('/forgot', {email: email})

  # info is an object with token and new password
  resetUserPassword: (info) ->
    $http.post('/reset', info)

  # returns an user object
  getUser: (username) ->
    $http.get("/data/user/#{username}.json").then(@genericSuccessCallback, @genericErrorCallback)

  updateUser:(user) ->
    username = user.get('username')
    $http.put("/data/user/#{username}.json", user.getInfo())
