angular.module('User').factory 'AuthenticationService', ($window) ->
  auth = if $window.sessionStorage.token isnt `undefined` then isLogged: true else isLogged: false
  console.log auth
  auth
