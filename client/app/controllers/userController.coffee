angular.module('User').controller 'UserController', ($scope, $http, $routeParams, $location, $window, UserService, AuthenticationService) ->

  $scope.logIn = (username, password) ->
    console.log 'login attempt: ' + username + ' ' + password
    if username isnt `undefined` and password isnt `undefined`
      UserService.logIn(username, password).success((data) ->
        AuthenticationService.isLogged = true
        $window.sessionStorage.token = data.token
        $window.sessionStorage.user = data.profile
        $location.path '/u/' + username
        console.log 'connexion success'
      ).error (status, data) ->
        console.log status
        console.log data

  $scope.signUp = (username, password, email, firstname, lastname, country) ->
    console.log 'click signup'
    if username isnt `undefined` and password isnt `undefined` and email isnt `undefined`
      UserService.signUp(username, password, email, firstname, lastname, country).success((data) ->
        $location.path '/login'
        console.log 'registration success'
      ).error (status, data) ->
        console.log status
        console.log data
