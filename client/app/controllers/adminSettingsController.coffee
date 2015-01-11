angular.module('Admin').controller 'AdminSettingsController', ($scope, $http, $routeParams, $location, $window, MenuService, SettingService) ->

  $scope.categoryList = []
  $scope.menuList = []
  $scope.newMenu = {id: '', name: '', route: ''}
  $scope.settings =
    title: 'Fluid'
    header:
      content: 'Fluid\n========'
      body: ''
    footer:
      content: ''
      body: ''

  err = (status, data) ->
    if status >= 400 and data.message == 'jwt expired'
      UserService.resetAuth()

  $scope.isActive = (route) ->
    $location.path() == route

  SettingService.get().success((data) ->
    $scope.settings = data
  ).error (status, data) ->
    console.log status
    console.log data

  $scope.saveSettings = (data) ->
    SettingService.save(data).success((res) ->
      console.log 'success'
    ).error (status, data) ->
      err status, data
      console.log status
      console.log data

  MenuService.getList().success((data) ->
    $scope.menuList = data
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
