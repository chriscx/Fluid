angular.module('Index').controller('IndexController', function($scope, $routeParams, $location, $window, UserService, AuthenticationService) {
  return $scope.pageName = 'Index Page';
});
