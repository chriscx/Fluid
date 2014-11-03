angular.module('Blog').controller 'BlogController', ($scope, $http, $routeParams, $location, $window, PostService) ->

  $scope.skip = 0
  $scope.limit = 7

  PostService.getBySlice($scope.skip, $scope.limit).success((data) ->
    $scope.posts = data
    
  ).error((status, data) ->
    console.log status
    console.log data
  )
  return
