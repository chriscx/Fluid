angular.module('Admin').controller 'AdminSettingsController', ($scope, $http, $routeParams, $location, $window, PostService, PageService, MenuService) ->

  $scope.categoryList = []
  $scope.newMenu = {id: '', name: '', route: ''}

  MenuService.getList().success((data) ->
    $scope.menuList = data
    console.log 'success'
  ).error (status, data) ->
    console.log status
    console.log data

  $scope.createMenuItem = (data) ->
    console.log 'click'
    MenuService.create(data).success((res) ->
      MenuService.getList().success((data) ->
        $scope.menuList = data
      ).error (status, data) ->
        console.log status
        console.log data
      console.log 'success'
    ).error (status, data) ->
      console.log status
      console.log data

  $scope.saveMenuItem = (data) ->
    MenuService.save(data.id, data).success((data) ->
      console.log 'success'
    ).error (status, data) ->
      console.log status
      console.log data

  $scope.deleteMenuItem = (data) ->
    MenuService.remove(data.id).success((data) ->
      console.log 'success'
    ).error (status, data) ->
      console.log status
      console.log data
