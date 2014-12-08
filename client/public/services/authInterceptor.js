angular.module('User').factory("authInterceptor", function($rootScope, $q, $window, AuthenticationService) {
  return {
    request: function(config) {
      config.headers = config.headers || {};
      if ($window.sessionStorage.token) {
        config.headers.Authorization = "Bearer " + $window.sessionStorage.token;
      }
      return config;
    },
    response: function(response) {
      if (response.status === 401) {
        AuthenticationService.isLogged = false;
      }
      return response || $q.when(response);
    }
  };
});
