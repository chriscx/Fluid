angular.module('Admin').controller 'AdminPostsController', ($scope, $http, $routeParams, $location, $window, UserService, PostService, PageService, CategoryService) ->

  err = (status, data) ->
    if status >= 400 and data.message == 'jwt expired'
      UserService.resetAuth()

  $scope.isActive = (route) ->
    $location.path() == route

  $scope.postList = []

  if $location.path().lastIndexOf('/admin/blog/posts/create', 0) == 0

    $scope.post =
      title: ''
      author: $window.sessionStorage.username
      body: ''
      tags: []
      category: ''
      comments: []
      published: true

    $scope.createPost = (post) ->
      PostService.create(post).success((data, status, headers, config) ->
        console.log 'success'
        $location.path '/admin/blog/posts'
      ).error (data, status, headers, config) ->
        err status, data
        console.log status
        console.log data

  else if $location.path().lastIndexOf('/admin/blog/posts/edit', 0) == 0

    PostService.get($location.path().slice(23)).success((data) ->
      $scope.post = data
      $scope.post.ident = $scope.post.id
    ).error (data, status, headers, config) ->
      err status, data
      console.log status
      console.log data

    CategoryService.getList().success((data) ->
      console.log data
      $scope.categories = data
    ).error (data, status, headers, config) ->
      err status, data
      console.log status
      console.log data

    $scope.savePost = (post) ->
      PostService.save(post.ident, post).success((data) ->
        console.log 'success'
        $location.path '/admin/blog/posts'
      ).error (data, status, headers, config) ->
        err status, data
        console.log status
        console.log data

    $scope.deletePost = (post) ->
      PostService.remove(post.ident).success((data) ->
        console.log 'success'
        $location.path '/admin/blog/posts'
      ).error (data, status, headers, config) ->
        err status, data
        console.log status
        console.log data

  else if $location.path().lastIndexOf('/admin/blog/posts', 0) == 0

    PostService.getList().success((data) ->
      $scope.postList = data
      console.log $scope.postList
    ).error (data, status, headers, config) ->
      err status, data
      console.log status
      console.log data

  else
    $location.path '/admin'
