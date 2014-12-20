angular.module('Blog').factory 'SettingService', ($http) ->
  getList: ->
    $http.get '/data/settings.json'

  get: (id) ->
    $http.get '/data/settings/' + id + '.json'

  create: (data) ->
    $http.post '/data/settings/', data

  save: (id, data) ->
    $http.put '/data/settings/' + id + '.json', data

  remove: (id) ->
    $http.delete '/data/settings/' + id + '.json'
