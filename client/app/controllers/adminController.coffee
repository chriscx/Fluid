angular.module('Admin').controller 'AdminController', ($scope, $http, PostService, PageService, CategoryService) ->

  PostService.getList().success((data) ->
    $scope.postList = data
    $scope.postList.ident = $scope.postList.id
  ).error (status, data) ->
    console.log status
    console.log data

  CategoryService.getList().success((data) ->
    $scope.categoryList = data
    $scope.categoryList.ident = $scope.categoryList.name
  ).error (status, data) ->
    console.log status
    console.log data

  PageService.getList().success((data) ->
    $scope.pageList = data
    $scope.pageList.ident = $scope.pageList.route
  ).error (status, data) ->
    console.log status
    console.log data

  $scope.createCategory = (data) ->
    CategoryService.create(data).success((data) ->
      console.log 'success'
    ).error (status, data) ->
      console.log status
      console.log data

  $scope.saveCategory = (name, data) ->
    CategoryService.save(name, data).success((data) ->
      console.log 'success'
    ).error (status, data) ->
      console.log status
      console.log data

  $scope.deleteCategory = (name) ->
    CategoryService.remove(name).success((data) ->
      console.log 'success'
    ).error (status, data) ->
      console.log status
      console.log data

  $scope.createPost = (data) ->
    PostService.create(data).success((data) ->
      console.log 'success'
    ).error (status, data) ->
      console.log status
      console.log data

  $scope.savePost = (id, data) ->
    PostService.save(id, data).success((data) ->
      console.log 'success'
    ).error (status, data) ->
      console.log status
      console.log data

  $scope.deletePost = (id) ->
    PostService.remove(id).success((data) ->
      $console.log 'success'
    ).error (status, data) ->
      console.log status
      console.log data

  $scope.createPage = (data) ->
    PageService.create(data).success((data) ->
      console.log 'success'
    ).error (status, data) ->
      console.log status
      console.log data

  $scope.savePage = (route, data) ->
    PageService.save(route, data).success((data) ->
      console.log 'success'
    ).error (status, data) ->
      console.log status
      console.log data

  $scope.deletePage = (route) ->
    PageService.remove(route).success((data) ->
      console.log 'success'
    ).error (status, data) ->
      console.log status
      console.log data

  $scope.editPost = (id) ->
    PostService.get(id).success((data) ->
      $scope.PostToEdit = data
      $location.path '/admin/blog/posts/edit/' + id
    ).error (status, data) ->
      console.log status
      console.log data

  $scope.editPage = (route) ->
    PageService.get(route).success((data) ->
      $scope.PageToEdit = data
      $location.path '/admin/pages/edit/' + id
    ).error (status, data) ->
      console.log status
      console.log data
