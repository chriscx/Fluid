var FluidApp;

FluidApp = angular.module('FluidApp', ['ngRoute', 'ngAnimate', 'Index', 'User']);

angular.module('Index', []);

angular.module('User', []);

angular.module('Blog', []);

angular.module('Page', []);

FluidApp.config([
  '$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
    $locationProvider.html5Mode(true);
    $routeProvider.when('/', {
      templateUrl: 'views/home.html',
      controller: 'IndexController',
      access: {
        requiredLogin: false
      }
    }).when('/login', {
      templateUrl: 'views/login.html',
      controller: 'UserController',
      access: {
        requiredLogin: false
      }
    }).when('/logout', {
      template: '',
      controller: 'LogoutController',
      access: {
        requiredLogin: false
      }
    }).when('/signup', {
      templateUrl: 'views/signup.html',
      controller: 'UserController',
      access: {
        requiredLogin: false
      }
    }).when('/u/:user', {
      templateUrl: 'views/player.html',
      controller: 'PlayerController',
      access: {
        requiredLogin: true
      }
    }).when('/u/:user/edit', {
      templateUrl: 'views/user.html',
      controller: 'UserController',
      access: {
        requiredLogin: true
      }
    }).otherwise({
      redirectTo: '/'
    });
  }
]);

FluidApp.config(function($httpProvider) {
  $httpProvider.interceptors.push("authInterceptor");
  return {
    signUp: function(username, password, email, firstname, lastname, country) {
      return $http.post('/signup', {
        username: username,
        password: password,
        email: email,
        firstname: firstname,
        lastname: lastname,
        country: country
      });
    }
  };
});

FluidApp.run(function($rootScope, $location, $window, AuthenticationService) {
  return $rootScope.$on('$routeChangeStart', function(event, nextRoute, currentRoute) {
    if (nextRoute.access.requiredLogin && !AuthenticationService.isLogged) {
      $location.path('/login');
    }
    if ((nextRoute === '/login' || nextRoute === '/signup') && AuthenticationService.isLogged) {
      return $location.path('/u/' + $window.session.user.username);
    }
  });
});
