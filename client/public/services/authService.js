angular.module('User').factory('AuthenticationService', function($window) {
  var auth;
  auth = $window.sessionStorage.token !== undefined ? {
    isLogged: true
  } : {
    isLogged: false
  };
  console.log(auth);
  return auth;
});
