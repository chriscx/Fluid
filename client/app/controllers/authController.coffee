angular.module('Auth').controller 'AuthController', ($scope, $http, $routeParams, $location, $window, UserService, AuthenticationService, MenuService) ->

  $scope.alerts = []
  $scope.user = {}

  if $location.path().lastIndexOf('/admin/user', 0) == 0
    UserService.getUserData($window.sessionStorage.username).success((data) ->
      $scope.user = data
      console.log $scope.user
    ).error (status, data) ->
      console.log status
      console.log data

  $scope.logIn = (username, password) ->
    console.log 'login attempt: ' + username + ' ' + password
    if username isnt `undefined` and password isnt `undefined`
      UserService.logIn(username, password).success((data) ->
        AuthenticationService.isLogged = true
        $window.sessionStorage.token = data.token
        $window.sessionStorage.username = data.user.username
        $window.sessionStorage.firstname = data.user.firstname
        $window.sessionStorage.lastname = data.user.lastname
        $location.path '/admin'
        console.log 'connexion success'
      ).error (status, data) ->
        $scope.alerts.push {type: 'danger', msg: "Couldn't login :( Please check username and password !"}
        console.log status
        console.log data

  $scope.signUp = (newUser) ->
    if newUser.username isnt `undefined` and
      newUser.password isnt `undefined` and
      newUser.email isnt `undefined` and
      newUser.password == newUser.passwordCheck
        UserService.signUp(newUser).success((data) ->
          $location.path '/login'
        ).error (status, data) ->
          $scope.alerts.push {type: 'danger', msg: "Woops something went wrong... couldn't create an account for you"}
          console.log status
          console.log data

  $scope.forgotPassword = (email) ->
    if email isnt `undefined`
      UserService.forgotPassword(email).success((data) ->
        console.log 'success'
      ).error (status, data) ->
        console.log status
        console.log data

  $scope.resetPassword = (password) ->
    if password isnt `undefined`
      UserService.resetPassword($routeParams.token, password).success((data) ->
        console.log 'success'
        $location.path '/login'
      ).error (status, data) ->
        console.log status
        console.log data
