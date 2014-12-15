angular.module('User').factory 'FileService', ($http, $location, $window, AuthenticationService) ->

  getList: () ->
    $http.get '/data/files.json'

  removeFile: (name) ->
    $http.delete '/data/files/' + name
