angular.module('Admin').controller 'AdminSettingsController', ($scope, $http, $routeParams, $location, $window, PostService, PageService, MenuService) ->

$scope.categoryList = []
$scope.newMenu = {id: '', name: ''}

MenuService.getList().success((data) ->
  $scope.categoryList = data
).error (status, data) ->
  console.log status
  console.log data

$scope.createMenuItem = (data) ->
  MenuService.create(data).success((res) ->
    MenuService.getList().success((data) ->
      $scope.categoryList = data
    ).error (status, data) ->
      console.log status
      console.log data
    console.log 'success'
  ).error (status, data) ->
    console.log status
    console.log data

$scope.saveMenuItem = (name, data) ->
  MenuService.save(name, data).success((data) ->
    console.log 'success'
  ).error (status, data) ->
    console.log status
    console.log data

$scope.deleteMenuItem = (name) ->
  MenuService.remove(name).success((data) ->
    console.log 'success'
  ).error (status, data) ->
    console.log status
    console.log data
