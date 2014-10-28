angular.module('Page').controller('PageController', function($scope, $http, $routeParams, $location, $window, PageService) {
  return PageService.get($location.path().slice(1)).success(function(data) {
    return $scope.page = data;
  }).error(function(status, data) {
    console.log(status);
    return console.log(data);
  });
});
