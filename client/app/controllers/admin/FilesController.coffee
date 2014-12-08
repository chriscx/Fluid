angular.module('Admin').controller 'AdminFilesController', ($scope, $http, $routeParams, $location, $window) ->

  $scope.isActive = (route) ->
    $location.path() == route
