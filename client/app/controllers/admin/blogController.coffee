angular.module('Admin').controller 'AdminBlogController', ($scope, $http, $routeParams, $location, $window, PostService, PageService, CategoryService) ->

  $scope.categoryList = []
  $scope.newCategory = {id: '', name: ''}

  CategoryService.getList().success((data) ->
    $scope.categoryList = data
  ).error (status, data) ->
    console.log status
    console.log data

  $scope.createCategory = (data) ->
    CategoryService.create(data).success((res) ->
      CategoryService.getList().success((data) ->
        $scope.categoryList = data
      ).error (status, data) ->
        console.log status
        console.log data
      console.log 'success'
    ).error (status, data) ->
      console.log status
      console.log data

  $scope.saveCategory = (data) ->
    CategoryService.save(data.id, data).success((data) ->
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
