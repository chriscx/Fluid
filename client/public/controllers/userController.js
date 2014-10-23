angular.module('User').controller('UserController', function($scope, $http, $routeParams, $location, $window, UserService, AuthenticationService) {
  $scope.logIn = function(username, password) {
    console.log('login attempt: ' + username + ' ' + password);
    if (username !== undefined && password !== undefined) {
      return UserService.logIn(username, password).success(function(data) {
        AuthenticationService.isLogged = true;
        $window.sessionStorage.token = data.token;
        $window.sessionStorage.user = data.profile;
        $location.path('/u/' + username);
        return console.log('connexion success');
      }).error(function(status, data) {
        console.log(status);
        return console.log(data);
      });
    }
  };
  return $scope.signUp = function(username, password, email, firstname, lastname, country) {
    console.log('click signup');
    if (username !== undefined && password !== undefined && email !== undefined) {
      return UserService.signUp(username, password, email, firstname, lastname, country).success(function(data) {
        $location.path('/login');
        return console.log('registration success');
      }).error(function(status, data) {
        console.log(status);
        return console.log(data);
      });
    }
  };
});
