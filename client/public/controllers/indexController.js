angular.module('Index').controller('IndexController', function($scope, $routeParams, $location, $window, UserService, AuthenticationService) {
  $scope.pageName = 'Index Page';
  return console.log($location.path().slice(1));
});
