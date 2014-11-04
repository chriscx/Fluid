angular.module('Admin').controller 'AdminPostsController', ($scope, $http, $routeParams, $location, $window, PostService, PageService, CategoryService) ->

  if $location.path().lastIndexOf('/admin/blog/posts/create', 0) == 0

    $scope.post =
      title: ''
      author: $window.sessionStorage.user.username
      body: ''
      tags: []
      category: ''
      comments: []
      published: true

    $scope.createPost = (data) ->
      PostService.create(data).success((data) ->
        console.log 'success'
      ).error (status, data) ->
        console.log status
        console.log data

  else if $location.path().lastIndexOf('/admin/blog/posts/edit', 0) == 0

    PostService.get($location.path().slice(22)).success((data) ->
      $scope.post = data
      $scope.post.ident = $scope.post.id
    ).error (status, data) ->
      console.log status
      console.log data

    $scope.savePost = (id, data) ->
      PostService.save(id, data).success((data) ->
        console.log 'success'
      ).error (status, data) ->
        console.log status
        console.log data

  else if $location.path().lastIndexOf('/admin/blog/posts', 0) == 0

    PostService.getList().success((data) ->
      $scope.postList = data
    ).error (status, data) ->
      console.log status
      console.log data

    $scope.deletePost = (id) ->
      PostService.remove(id).success((data) ->
        $console.log 'success'
      ).error (status, data) ->
        console.log status
        console.log data

  else
    $location.path '/admin'
