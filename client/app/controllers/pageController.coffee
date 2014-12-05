angular.module('Page').controller 'PageController', ($scope, $http, $routeParams, $location, $window, PageService, MenuService) ->

  console.log $location.path().slice(1)
  PageService.get($location.path().slice(1)).success((data) ->
    console.log data
    if data.length < 1
      $scope.page =
        title: '404 Not found'
        body: 'Oh...Sorry but I couldn\'t find this page :/'
    else
      $scope.page = data
  ).error (status, data) ->
    console.log status
    console.log data

  MenuService.getList().success((data) ->
    $scope.menu = data
  ).error (status, data) ->
    console.log status
    console.log data

  $scope.isActive = (route) ->
    # console.log 'path: ' + $location.path()
    # console.log 'route: ' + route
    $scope.path = $location.path()
    $location.path() == route
