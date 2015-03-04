angular.module('Auth').factory 'AuthenticationService', ($window, $location) ->
  auth = if $window.sessionStorage.token isnt `undefined` then isLogged: true else isLogged: false
  auth
