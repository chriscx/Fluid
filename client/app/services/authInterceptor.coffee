angular.module('User').factory "authInterceptor", ($rootScope, $q, $window, $location, AuthenticationService) ->
  request: (config) ->
    config.headers = config.headers or {}
    config.headers.Authorization = "Bearer " + $window.sessionStorage.token  if $window.sessionStorage.token
    config

  response: (response) ->
    if response.status is 401
      AuthenticationService.isLogged = false
      delete $window.sessionStorage.token
      delete $window.sessionStorage.username
      delete $window.sessionStorage.firstname
      delete $window.sessionStorage.lastname
      $location.path = '/login'
    response or $q.when(response)
