angular.module('User').factory('AuthenticationService', function($window, $location) {
  var auth;
  auth = $window.sessionStorage.token !== undefined ? {
    isLogged: true
  } : {
    isLogged: false
  };
  return auth;
});
