angular.module('Index').controller('IndexController', function($scope, $routeParams, $location, $window, UserService, AuthenticationService, MenuService, PageService) {
  $scope.isActive = function(route) {
    if (route === '//') {
      route = '/';
    }
    return $location.path() === route;
  };
  MenuService.getList().success(function(data) {
    return $scope.menu = data;
  }).error(function(status, data) {
    console.log(status);
    return console.log(data);
  });
  return PageService.get('index').success(function(data) {
    $scope.page = data;
    return console.log($scope.page);
  }).error(function(status, data) {
    console.log(status);
    return console.log(data);
  });
});
