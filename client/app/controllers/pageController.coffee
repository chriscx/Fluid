angular.module('Page').controller 'PageController', ($scope, $http, $routeParams, $location, $window, PageService) ->

  PageService.get($location.path().slice(1)).success((data) ->
    $scope.page = data
  ).error (status, data) ->
    console.log status
    console.log data
