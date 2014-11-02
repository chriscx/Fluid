var FluidApp;

FluidApp = angular.module('FluidApp', ['ngRoute', 'ngAnimate', 'Index', 'User', 'Blog', 'Page', 'Admin']);

angular.module('Index', []);

angular.module('User', []);

angular.module('Blog', []);

angular.module('Page', []);

angular.module('Admin', []);

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
    }).when('/admin', {
      templateUrl: 'views/admin/settings.html',
      controller: 'AdminController',
      access: {
        requiredLogin: true
      }
    }).when('/admin/blog', {
      templateUrl: 'views/admin/blog/blog.html',
      controller: 'AdminController',
      access: {
        requiredLogin: true
      }
    }).when('/admin/blog/posts', {
      templateUrl: 'views/admin/blog/posts.html',
      controller: 'AdminController',
      access: {
        requiredLogin: true
      }
    }).when('/admin/blog/posts/create', {
      templateUrl: 'views/admin/blog/createPost.html',
      controller: 'AdminController',
      access: {
        requiredLogin: true
      }
    }).when('/admin/blog/posts/edit/:id', {
      templateUrl: 'views/admin/blog/editPost.html',
      controller: 'AdminController',
      access: {
        requiredLogin: true
      }
    }).when('/admin/pages', {
      templateUrl: 'views/admin/pages/pages.html',
      controller: 'AdminController',
      access: {
        requiredLogin: true
      }
    }).when('/admin/pages/create', {
      templateUrl: 'views/admin/pages/createPage.html',
      controller: 'AdminController',
      access: {
        requiredLogin: true
      }
    }).when('/admin/pages/edit/:route', {
      templateUrl: 'views/admin/pages/editPage.html',
      controller: 'AdminController',
      access: {
        requiredLogin: true
      }
    }).when('/admin/:user', {
      templateUrl: 'views/admin/users/user.html',
      controller: 'UserController',
      access: {
        requiredLogin: true
      }
    }).when('/admin/:user/edit', {
      templateUrl: 'views/admin/users/userEdit.html',
      controller: 'UserController',
      access: {
        requiredLogin: true
      }
    }).when('/blog/', {
      templateUrl: 'views/blog.html',
      controller: 'BlogController',
      access: {
        requiredLogin: false
      }
    }).when('/blog/:id', {
      templateUrl: 'views/post.html',
      controller: 'PostController',
      access: {
        requiredLogin: false
      }
    }).when('/:route', {
      templateUrl: 'views/page.html',
      controller: 'PageController',
      access: {
        requiredLogin: false
      }
    }).otherwise({
      redirectTo: '/'
    });
  }
]);

FluidApp.config(function($httpProvider) {
  return $httpProvider.interceptors.push("authInterceptor");
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
