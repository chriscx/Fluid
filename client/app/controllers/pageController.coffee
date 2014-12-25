angular.module('Page').controller 'PageController', ($scope, $http, $routeParams, $location, $window, $sce, PageService, MenuService) ->

  $scope.page = {}

  if $location.path() == '/'
    PageService.get('index').success((data) ->
      $scope.page = data
      $scope.page.htmlSafe =
         $sce.trustAsHtml($scope.page.body)
    ).error (status, data) ->
      console.log status
      console.log data
  else
    console.log $location.path().slice(1)
    PageService.get($location.path().slice(1)).success((data) ->
      $scope.page = data
      $scope.page.htmlSafe =
         $sce.trustAsHtml($scope.page.body)
    ).error (status, data) ->
      console.log status
      console.log data
