angular.module('User').controller('UserController', function($scope, $http, $routeParams, $location, $window, UserService, AuthenticationService, MenuService) {
  $scope.alerts = [];
  $scope.user = {};
  $scope.logIn = function(username, password) {
    console.log('login attempt: ' + username + ' ' + password);
    if (username !== undefined && password !== undefined) {
      return UserService.logIn(username, password).success(function(data) {
        AuthenticationService.isLogged = true;
        $window.sessionStorage.token = data.token;
        $window.sessionStorage.username = data.user.username;
        $window.sessionStorage.firstname = data.user.firstname;
        $window.sessionStorage.lastname = data.user.lastname;
        $location.path('/admin');
        return console.log('connexion success');
      }).error(function(status, data) {
        $scope.alerts.push({
          type: 'danger',
          msg: "Couldn't login :( Please check username and password !"
        });
        console.log(status);
        return console.log(data);
      });
    }
  };
  $scope.signUp = function(newUser) {
    if (newUser.username !== undefined && newUser.password !== undefined && newUser.email !== undefined && newUser.password === newUser.passwordCheck) {
      return UserService.signUp(newUser).success(function(data) {
        return $location.path('/login');
      }).error(function(status, data) {
        $scope.alerts.push({
          type: 'danger',
          msg: "Woops something went wrong... couldn't create an account for you"
        });
        console.log(status);
        return console.log(data);
      });
    }
  };
  $scope.update = function(username, email, firstname, lastname, country) {
    if (username !== undefined && email !== undefined && firstname !== undefined && lastname !== undefined && country !== undefined) {
      return UserService.updateUserData(username, {
        email: email,
        firstname: firstname,
        lastname: lastname,
        country: country
      }).success(function(data) {
        return console.log('success');
      }).error(function(status, data) {
        console.log(status);
        return console.log(data);
      });
    }
  };
  $scope.forgotPassword = function(email) {
    if (email !== undefined) {
      return UserService.forgotPassword(email).success(function(data) {
        return console.log('success');
      }).error(function(status, data) {
        console.log(status);
        return console.log(data);
      });
    }
  };
  $scope.resetPassword = function(password) {
    if (password !== undefined) {
      return UserService.resetPassword(password).success(function(data) {
        return console.log('success');
      }).error(function(status, data) {
        console.log(status);
        return console.log(data);
      });
    }
  };
  return MenuService.getList().success(function(data) {
    return $scope.menu = data;
  }).error(function(status, data) {
    console.log(status);
    return console.log(data);
  });
});
