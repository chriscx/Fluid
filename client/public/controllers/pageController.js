angular.module('Page').controller('PageController', function($scope, $http, $routeParams, $location, $window, PageService, MenuService) {
  var rendered;
  rendered = true;
  PageService.get($location.path().slice(1), rendered).success(function(data) {
    if (data.length < 1) {
      return $scope.page = {
        title: '404 Not found',
        body: 'Oh...Sorry but I couldn\'t find this page :/'
      };
    } else {
      return $scope.page = data[0];
    }
  }).error(function(status, data) {
    console.log(status);
    return console.log(data);
  });
  MenuService.getList().success(function(data) {
    return $scope.menu = data;
  }).error(function(status, data) {
    console.log(status);
    return console.log(data);
  });
  return $scope.isActive = function(route) {
    console.log('path: ' + $location.path());
    console.log('route: ' + route);
    $scope.path = $location.path();
    return $location.path() === route;
  };
});
