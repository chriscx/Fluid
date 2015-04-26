angular.module('Blog').factory 'MenuService', ($http, Menu) ->

  genericErrorCallback: (response) ->
    console.log "error", response
    $q.reject(response)

  genericSuccessCallback = (response) -> new Menu response.data

  getMenuList: ->
    $http.get('/data/menu.json')

  getMenu: (id) ->
    $http.get("/data/menu/#{id}.json")

  removeMenu: (id) ->
    $http.delete("/data/menu/#{id}.json")

  createMenu: (id) ->
    $http.post('/data/menu/', id)

  saveMenu: (id, data) ->
    $http.put("/data/menu/#{id}.json", data)
