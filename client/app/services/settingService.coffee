angular.module('Blog').factory 'SettingService', ($http) ->
  get: ->
    $http.get '/data/settings.json'

  create: (data) ->
    $http.post '/data/settings.json', data

  save: (data) ->
    $http.put '/data/settings.json', data
