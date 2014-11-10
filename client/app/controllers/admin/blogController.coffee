angular.module('Admin').controller 'AdminBlogController', ($scope, $http, $routeParams, $location, $window, PostService, PageService, CategoryService) ->

  $scope.categoryList = []

  CategoryService.getList().success((data) ->
    $scope.categoryList = data
    $scope.categoryList.ident = $scope.categoryList.name
  ).error (status, data) ->
    console.log status
    console.log data

  $scope.createCategory = (data) ->
    CategoryService.create(data).success((data) ->
      $scope.categoryList.concat data
      console.log $scope.categoryList
      $scope.newCategory.name = ''
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
