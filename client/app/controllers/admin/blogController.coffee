angular.module('Admin').controller 'AdminBlogController', ($scope, $http, $routeParams, $location, $window, PostService, PageService, CategoryService) ->

  $scope.categoryList = []
  $scope.newCategory = {id: '', name: ''}

  $scope.isActive = (route) ->
    console.log 'path: ' + $location.path()
    console.log 'route: ' + route
    $scope.path = $location.path()
    $location.path() == route

  CategoryService.getList().success((data) ->
    $scope.categoryList = data
  ).error (status, data) ->
    console.log status
    console.log data

  $scope.createCategory = (cat) ->
    CategoryService.create(cat).success((res) ->
      CategoryService.getList().success((data) ->
        $scope.categoryList = data
      ).error (status, data) ->
        console.log status
        console.log data
      console.log 'success'
    ).error (status, data) ->
      console.log status
      console.log data

  $scope.saveCategory = (cat) ->
    CategoryService.save(cat.id, data).success((data) ->
      console.log 'success'
      $location.path '/admin/blog'
    ).error (status, data) ->
      console.log status
      console.log data

  $scope.deleteCategory = (cat) ->
    CategoryService.remove(cat.id).success((data) ->
      console.log 'success'
      $location.path '/admin/blog'
    ).error (status, data) ->
      console.log status
      console.log data
