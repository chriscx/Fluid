angular.module('Blog').factory 'MenuService', ($http) ->
  getList: ->
    $http.get '/data/menu.json'

  get: (id) ->
    $http.get '/data/menu/' + id + '.json'

  remove: (id) ->
    $http.delete '/data/menu/' + id + '.json'

  create: (id) ->
    $http.post '/data/menu/', id

  save: (id, data) ->
    $http.put '/data/menu/' + id + '.json', data
