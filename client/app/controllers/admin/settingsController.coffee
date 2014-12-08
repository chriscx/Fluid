angular.module('Admin').controller 'AdminSettingsController', ($scope, $http, $routeParams, $location, $window, PostService, PageService, MenuService) ->

  $scope.categoryList = []
  $scope.menuList = []
  $scope.newMenu = {id: '', name: '', route: ''}

  err = (status, data) ->
    if status >= 400 and data.message == 'jwt expired'
      UserService.resetAuth()

  $scope.isActive = (route) ->
    $location.path() == route

  MenuService.getList().success((data) ->
    $scope.menuList = data
    console.log 'success'
  ).error (status, data) ->
    err status, data
    console.log status
    console.log data

  $scope.createMenuItem = (data) ->
    console.log 'click'
    MenuService.create(data).success((res) ->
      MenuService.getList().success((data) ->
        $scope.menuList = data
      ).error (status, data) ->
        err status, data
        console.log status
        console.log data
      console.log 'success'
    ).error (status, data) ->
      err status, data
      console.log status
      console.log data

  $scope.saveMenuItem = (data) ->
    MenuService.save(data.id, data).success((data) ->
      console.log 'success'
    ).error (status, data) ->
      err status, data
      console.log status
      console.log data

  $scope.deleteMenuItem = (data) ->
    MenuService.remove(data.id).success((data) ->
      MenuService.getList().success((data) ->
        $scope.menuList = data
      ).error (status, data) ->
        err status, data
        console.log status
        console.log data
    ).error (status, data) ->
      err status, data
      console.log status
      console.log data
