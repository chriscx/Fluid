angular.module('User').factory('AuthenticationService', function($window, $location) {
  var auth, redirectToLogin;
  auth = $window.sessionStorage.token !== undefined ? {
    isLogged: true
  } : {
    isLogged: false
  };
  console.log(auth);
  auth;
  return redirectToLogin = function() {
    return $location.path = '/login';
  };
});
