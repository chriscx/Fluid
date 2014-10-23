angular.module('User').factory "authInterceptor", ($rootScope, $q, $window) ->
  request: (config) ->
    config.headers = config.headers or {}
    config.headers.Authorization = "Bearer " + $window.sessionStorage.token  if $window.sessionStorage.token
    config

  response: (response) ->
    response.status is 401

    # handle the case where the user is not authenticated
    response or $q.when(response)
