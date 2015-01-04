angular.module('User').controller('UserController', function($scope, $http, $routeParams, $location, $window, UserService, AuthenticationService, MenuService) {
  $scope.alerts = [];
  $scope.user = {};
  if ($location.path().lastIndexOf('/admin/user', 0) === 0) {
    UserService.getUserData($window.sessionStorage.username).success(function(data) {
      $scope.user = data;
      return console.log($scope.user);
    }).error(function(status, data) {
      console.log(status);
      return console.log(data);
    });
  }
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
  $scope.update = function(user) {
    if (user.username !== undefined && user.username !== '' && user.email !== undefined && user.email !== '') {
      if (user.password === '') {
        del(user.password);
      }
      return UserService.updateUserData(user.username, user).success(function(data) {
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
  return $scope.resetPassword = function(password) {
    if (password !== undefined) {
      return UserService.resetPassword($routeParams.token, password).success(function(data) {
        console.log('success');
        return $location.path('/login');
      }).error(function(status, data) {
        console.log(status);
        return console.log(data);
      });
    }
  };
});
