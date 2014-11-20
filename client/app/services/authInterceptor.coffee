angular.module('User').factory "authInterceptor", ($rootScope, $q, $window, AuthenticationService) ->
  request: (config) ->
    config.headers = config.headers or {}
    config.headers.Authorization = "Bearer " + $window.sessionStorage.token  if $window.sessionStorage.token
    config

  response: (response) ->
    if response.status is 401 or response.status is 500
      AuthenticationService.isLogged = false
    response or $q.when(response)
