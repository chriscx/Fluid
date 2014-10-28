angular.module('Blog').controller 'PostController', ($scope, $http, $routeParams, $location, $window) ->

PostService.get($location.path().slice(6)).success((data) ->
  $scope.post = data
).error (status, data) ->
  console.log status
  console.log data
