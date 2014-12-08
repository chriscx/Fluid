angular.module('Page').controller('PageController', function($scope, $http, $routeParams, $location, $window, PageService, MenuService) {
  console.log($location.path().slice(1));
  PageService.get($location.path().slice(1)).success(function(data) {
    console.log(data);
    if (data.length < 1) {
      return $scope.page = {
        title: '404 Not found',
        body: 'Oh...Sorry but I couldn\'t find this page :/'
      };
    } else {
      return $scope.page = data;
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
    return $location.path() === route;
  };
});
