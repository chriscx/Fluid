angular.module('Admin').controller 'AdminFilesController', ($scope, $http, $routeParams, $location, $window, FileService) ->

  $scope.fileList = []

  FileService.getList().success((data) ->
    $scope.fileList = data
    console.log 'success'
  ).error (status, data) ->
    err status, data

  err = (status, data) ->
    if status >= 400 and data.message == 'jwt expired'
      UserService.resetAuth()

  $scope.isActive = (route) ->
    $location.path() == route

  $scope.removeFile = (id) ->
    FileService.remove(id).success((data) ->
      console.log 'success'
      FileService.getList().success((data) ->
        $scope.fileList = data
        console.log 'success'
      ).error (status, data) ->
        err status, data
    ).error (status, data) ->
      err status, data
