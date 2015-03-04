angular.module('Site').factory 'PageService', ($http, Page) ->

  genericErrorCallback: (response) ->
    console.log "error", response
    $q.reject(response)

  genericSuccessCallback = (response) -> new Page response.data

  getPageList: ->
    $http.get('/data/pages.json')

  getPage: (id) ->
    $http.get("/data/page/#{id}.json")

  removePage: (id) ->
    $http.delete("/data/page/#{id}.json")

  createPage: (data) ->
    $http.post('/data/page/', data)

  savePage: (id, data) ->
    $http.put("/data/page/#{id}.json", data)
