angular.module('Blog').factory 'CategoryService', ($http) ->
  getList: ->
    $http.get '/data/blog/categories.json'

  get: (name) ->
    $http.get '/data/blog/category/' + name + '.json'

  remove: (name) ->
    $http.delete '/data/blog/category/' + name + '.json'

  create: (data) ->
    $http.post '/data/blog/category/', data

  save: (name, data) ->
    $http.put '/data/blog/category/' + name + '.json', data
