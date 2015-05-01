angular.module('Site').factory 'PageService', ($http, Page) ->

  genericErrorCallback: (response) ->
    console.log "error", response
    $q.reject(response)

  genericSuccessCallback = (response) -> new Page response.data

  getList: ->
    $http.get('/data/pages.json')

  get: (id) ->
    $http.get("/data/page/#{id}.json")

  remove: (id) ->
    $http.delete("/data/page/#{id}.json")

  create: (data) ->
    $http.post('/data/page/', data)

  save: (id, data) ->
    $http.put("/data/page/#{id}.json", data)
