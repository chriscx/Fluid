angular.module('Index').controller 'IndexController', ($scope, $routeParams, $location, $window, UserService, AuthenticationService, MenuService, PageService) ->

  $scope.title = 'TEST'
  # $scope.isActive = (route) ->
  #   route = '/' if route == '//'
  #   $location.path() == route
  #
  # MenuService.getList().success((data) ->
  #   $scope.menu = data
  # ).error (status, data) ->
  #   console.log status
  #   console.log data
  #
  # PageService.get('index').success((data) ->
  #   $scope.page = data
  #   console.log $scope.page
  # ).error (status, data) ->
  #   console.log status
  #   console.log data
