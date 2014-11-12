angular.module('Blog').factory 'CategoryService', ($http) ->
  getList: ->
    $http.get '/data/blog/categories.json'

  get: (id) ->
    $http.get '/data/blog/category/' + id + '.json'

  remove: (id) ->
    $http.delete '/data/blog/category/' + id + '.json'

  create: (id) ->
    $http.post '/data/blog/category/', id

  save: (id, data) ->
    $http.put '/data/blog/category/' + id + '.json', data
