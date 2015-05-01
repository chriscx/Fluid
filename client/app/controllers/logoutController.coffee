angular.module('Auth').controller 'LogoutController', ($scope, $routeParams, $location, $window, UserService, AuthenticationService) ->
  if AuthenticationService.isLogged
    AuthenticationService.isLogged = false
    delete $window.sessionStorage.token
  $location.path '/'
