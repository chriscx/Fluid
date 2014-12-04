angular.module('Index').controller 'IndexController', ($scope, $routeParams, $location, $window, UserService, AuthenticationService, MenuService, PageService) ->
  $scope.pageName = 'Index Page'

  $scope.isActive = (route) ->
    console.log 'path: ' + $location.path()
    console.log 'route: ' + route
    $scope.path = $location.path()
    $location.path() == route

  MenuService.getList().success((data) ->
    $scope.menu = data
  ).error (status, data) ->
    console.log status
    console.log data

  PageService.get('index').success((data) ->
    $scope.page = data
  ).error (status, data) ->
    console.log status
    console.log data
