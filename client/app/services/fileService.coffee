angular.module('User').factory 'FileService', ($http, $location, $window) ->

  getList: () ->
    $http.get '/data/files.json'

  remove: (id) ->
    $http.delete '/data/files/' + id
