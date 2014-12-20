angular.module('Blog').controller 'BlogController', ($scope, $http, $routeParams, $location, $window, PostService, MenuService) ->

  $scope.skip = 0
  $scope.limit = 5

  PostService.getBySlice($scope.skip, $scope.limit).success((data) ->
    console.log(data)
    $scope.posts = data if data.length != 0
  ).error((status, data) ->
    console.log status
    console.log data
  )

  MenuService.getList().success((data) ->
    $scope.menu = data
  ).error (status, data) ->
    console.log status
    console.log data

  $scope.isActive = (route) ->
    $location.path() == route

  $scope.getNext = () ->
    $scope.skip += 5
    $scope.limit += 5
    PostService.getBySlice($scope.skip, $scope.limit).success((data) ->
      console.log(data)
      $scope.posts = data if data.length != 0
    ).error((status, data) ->
      console.log status
      console.log data
    )

  $scope.getPrevious = () ->
    $scope.skip -= 5
    $scope.limit -= 5
    PostService.getBySlice($scope.skip, $scope.limit).success((data) ->
      console.log(data)
      $scope.posts = data if data.length != 0
    ).error((status, data) ->
      console.log status
      console.log data
    )

  $scope.navIsActive = () ->
    if $scope.skip == 0
      return true
    else
      return false
