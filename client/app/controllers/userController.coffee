angular.module('User').controller 'UserController', ($scope, $http, $routeParams, $location, $window, UserService, AuthenticationService, MenuService) ->

  $scope.alerts = []
  $scope.user = {}

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
    console.log newUser
    if newUser.username isnt `undefined` and
      newUser.password isnt `undefined` and
      newUser.email isnt `undefined` and
      newUser.password == newUser.passwordCheck
        console.log newUser
        UserService.signUp(newUser).success((data) ->
          $location.path '/login'
          console.log 'registration success'
        ).error (status, data) ->
          $scope.alerts.push {type: 'danger', msg: "Woops something went wrong... couldn't create an account for you"}
          console.log status
          console.log data

  $scope.update = (username, email, firstname, lastname, country) ->
    if username isnt `undefined` and
      email isnt `undefined` and
      firstname isnt `undefined` and
      lastname isnt `undefined` and
      country isnt `undefined`
        UserService.updateUserData(username, {email: email, firstname: firstname, lastname: lastname, country: country}).success((data) ->
          console.log 'success'
        ).error (status, data) ->
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
      UserService.resetPassword(password).success((data) ->
        console.log 'success'
      ).error (status, data) ->
        console.log status
        console.log data

  MenuService.getList().success((data) ->
    $scope.menu = data
  ).error (status, data) ->
    console.log status
    console.log data
