angular.module('User').controller 'LogoutController', ($scope, $routeParams, $location, $window, UserService, AuthenticationService) ->
  if AuthenticationService.isLogged
    console.log 'deleting auth data'
    AuthenticationService.isLogged = false
    delete $window.sessionStorage.token
    $location.path '/'
