FluidApp = angular.module('FluidApp', ['ngRoute', 'ngAnimate', 'Index', 'User'])

angular.module('Index', [])
angular.module('User', [])
angular.module('Blog', [])
angular.module('Page', [])

FluidApp.config ['$locationProvider', '$routeProvider', ($locationProvider, $routeProvider) ->
  $locationProvider.html5Mode true
  $routeProvider.when('/',
    templateUrl: 'views/home.html'
    controller: 'IndexController'
    access:
      requiredLogin: false
  ).when('/login',
    templateUrl: 'views/login.html'
    controller: 'UserController'
    access:
      requiredLogin: false
  ).when('/logout',
    template: ''
    controller: 'LogoutController'
    access:
      requiredLogin: false
  ).when('/signup',
    templateUrl: 'views/signup.html'
    controller: 'UserController'
    access:
      requiredLogin: false
  ).when('/admin/:user',
    templateUrl: 'views/admin/site.html'
    controller: 'UserController'
    access:
      requiredLogin: true
  ).when('/admin/:user/blog',
    templateUrl: 'views/admin/blog.html'
    controller: 'UserController'
    access:
      requiredLogin: true
  ).when('/admin/:user/posts',
    templateUrl: 'views/admin/post.html'
    controller: 'UserController'
    access:
      requiredLogin: true
  ).when('/admin/:user/pages',
    templateUrl: 'views/admin/page.html'
    controller: 'UserController'
    access:
      requiredLogin: true
  ).when('/admin/:user/edit',
    templateUrl: 'views/user.html'
    controller: 'UserController'
    access:
      requiredLogin: true
  ).when('/blog/',
    templateUrl: 'views/post.html'
    controller: 'PostController'
    access:
      requiredLogin: false
  ).when('/blog/:id',
    templateUrl: 'views/blog.html'
    controller: 'BlogController'
    access:
      requiredLogin: false
  ).when('/:route',
    templateUrl: 'views/page.html'
    controller: 'PageController'
    access:
      requiredLogin: false
  ).otherwise redirectTo: '/'
  return
]

FluidApp.config ($httpProvider) ->
  $httpProvider.interceptors.push "authInterceptor"

FluidApp.run ($rootScope, $location, $window, AuthenticationService) ->
  $rootScope.$on '$routeChangeStart', (event, nextRoute, currentRoute) ->
    $location.path '/login' if nextRoute.access.requiredLogin and not AuthenticationService.isLogged
    $location.path '/u/' + $window.session.user.username if nextRoute in ['/login', '/signup'] and AuthenticationService.isLogged
