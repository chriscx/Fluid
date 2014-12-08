angular.module('User').controller('LogoutController', function($scope, $routeParams, $location, $window, UserService, AuthenticationService) {
  if (AuthenticationService.isLogged) {
    AuthenticationService.isLogged = false;
    delete $window.sessionStorage.token;
    return $location.path('/');
  }
});
