angular.module('Blog').controller 'BlogController', ($scope, $http, $routeParams, $location, $window, PostService, MenuService) ->

  $scope.skip = 0
  $scope.limit = 7

  PostService.getBySlice($scope.skip, $scope.limit).success((data) ->
    console.log(data)
    $scope.posts = data

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
    console.log 'route ' + route
    console.log 'path ' + $location.path() 
    $location.path() == route
