angular.module('Blog').factory 'PostService', ($http) ->
  getList: ->
    $http.get '/data/blog/posts.json'

  getBySlice: (s, l) ->
    $http.get '/data/blog/post/' + s + '/' + l + '/posts.json'

  get: (id) ->
    $http.get '/data/blog/post/' + id + '.json'

  create: (data) ->
    $http.post '/data/blog/post/', data

  save: (id, data) ->
    $http.put '/data/blog/post/' + id + '.json', data

  remove: (id) ->
    $http.delete '/data/blog/post/' + id + '.json'
