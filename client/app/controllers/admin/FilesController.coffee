angular.module('Admin').controller 'AdminFilesController', ($scope, $http, $routeParams, $location, $window) ->

  $scope.isActive = (route) ->
    $location.path() == route

  err = (status, data) ->
    if status >= 400 and data.message == 'jwt expired'
      UserService.resetAuth()

  $scope.isActive = (route) ->
    $location.path() == route

  FileService.getList().success((data) ->
    $scope.fileList = data
    console.log 'success'
  ).error (status, data) ->
    err status, data
    console.log status
    console.log data
