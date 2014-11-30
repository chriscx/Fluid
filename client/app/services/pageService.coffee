angular.module('Page').factory 'PageService', ($http) ->
  getList: ->
    $http.get '/data/pages.json'

  get: (route, render) ->
    if render is true
      $http.get '/data/page/render/' + route + '.json'
    else
      $http.get '/data/page/' + route + '.json'

  remove: (route) ->
    $http.delete '/data/page/' + route + '.json'

  create: (data) ->
    $http.post '/data/page/', data

  save: (route, data) ->
    $http.put '/data/page/' + route + '.json', data
