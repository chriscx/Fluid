angular.module('Blog').controller 'PostController', ($scope, $http, $routeParams, $location, $window, PostService, MenuService) ->

  PostService.get($location.path().slice(6)).success((data) ->
    $scope.post = data
    $scope.post.htmlSafe =
       $sce.trustAsHtml($scope.post.body)
  ).error (status, data) ->
    console.log status
    console.log data

  MenuService.getList().success((data) ->
    $scope.menu = data
  ).error (status, data) ->
    console.log status
    console.log data

  $scope.isActive = (route) ->
    $location.path() == route
