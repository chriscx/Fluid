angular.module('User').factory 'AuthenticationService', ($window, $location) ->
  auth = if $window.sessionStorage.token isnt `undefined` then isLogged: true else isLogged: false
  console.log auth
  auth

  redirectToLogin = () ->
    $location.path = '/login'
