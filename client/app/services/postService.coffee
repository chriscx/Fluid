angular.module('Blog').factory 'PostService', ($http, Post) ->

  genericErrorCallback: (response) ->
    console.log "error", response
    $q.reject(response)

  getPostList: ->
    $http.get('/data/blog/posts.json')

  getPostsBySlice: (s, l) ->
    successCallback = (response) ->
      #loop and process array
      new Post response.data
    $http.get("/data/blog/post/#{s}/#{l}/posts.json")

  getPost: (id) ->
    successCallback = (response) -> new Post response.data
    $http.get("/data/blog/post/#{id}.json").then(@successCallback, @genericErrorCallback)

  createPost: (data) ->
    $http.post('/data/blog/post/', data)

  savePost: (id, data) ->
    $http.put("/data/blog/post/#{id}.json", data)

  removePost: (id) ->
    $http.delete("/data/blog/post/#{id}.json")
