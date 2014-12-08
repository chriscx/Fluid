angular.module('Admin').controller('AdminFilesController', function($scope, $http, $routeParams, $location, $window) {
  return $scope.isActive = function(route) {
    return $location.path() === route;
  };
});
