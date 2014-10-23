angular.module('Page').controller 'PageController', ($scope, $http, $routeParams, $location, $window) ->

  $.get '/blog/posts/0/5/posts.json', (data) ->
    console.log data
    $scope.$apply ->
      $scope.posts = data.entries
