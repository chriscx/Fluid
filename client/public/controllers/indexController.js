angular.module('Index').controller('IndexController', function($scope, $routeParams, $location, $window, UserService, AuthenticationService, MenuService) {
  $scope.pageName = 'Index Page';
  $scope.isActive = function(route) {
    console.log('path: ' + $location.path());
    console.log('route: ' + route);
    $scope.path = $location.path();
    return $location.path() === route;
  };
  return MenuService.getList().success(function(data) {
    return $scope.menu = data;
  }).error(function(status, data) {
    console.log(status);
    return console.log(data);
  });
});
