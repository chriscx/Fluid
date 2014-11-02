angular.module('Blog').controller 'PostController', ($scope, $http, $routeParams, $location, $window, PostService) ->

  PostService.get($location.path().slice(6)).success((data) ->
    if data is null
      console.log 1
      $scope.post =
        title: '404 Not found'
        author: 'Server'
        creationDate: new Date()
        body: 'Oh...Sorry but I couldn\'t find this post :/'
    else
      $scope.post = data
  ).error (status, data) ->
    console.log status
    console.log data
