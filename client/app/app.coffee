FluidApp = angular.module('FluidApp', ['ngRoute', 'ngAnimate', 'hc.marked', 'textAngular', 'Index', 'User', 'Blog', 'Page', 'Admin'])

angular.module('Index', [])
angular.module('User', [])
angular.module('Blog', [])
angular.module('Page', [])
angular.module('Admin', [])

FluidApp.config ['$locationProvider', '$routeProvider', ($locationProvider, $routeProvider) ->
  $locationProvider.html5Mode true
  $routeProvider.when('/',
    templateUrl: 'views/page.html'
    controller: 'PageController'
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
  ).when('/forgot',
    templateUrl: 'views/forgot.html'
    controller: 'UserController'
    access:
      requiredLogin: false
  ).when('/reset/:token',
    templateUrl: 'views/reset.html'
    controller: 'UserController'
    access:
      requiredLogin: false
  ).when('/admin',
    templateUrl: 'views/admin.settings.html'
    controller: 'AdminSettingsController'
    access:
      requiredLogin: true
  ).when('/admin/blog/posts',
    templateUrl: 'views/admin.posts.html'
    controller: 'AdminPostsController'
    access:
      requiredLogin: true
  ).when('/admin/blog/posts/create',
    templateUrl: 'views/admin.createPost.html'
    controller: 'AdminPostsController'
    access:
      requiredLogin: true
  ).when('/admin/blog/posts/edit/:id',
    templateUrl: 'views/admin.editPost.html'
    controller: 'AdminPostsController'
    access:
      requiredLogin: true
  ).when('/admin/pages',
    templateUrl: 'views/admin.pages.html'
    controller: 'AdminPagesController'
    access:
      requiredLogin: true
  ).when('/admin/pages/create',
    templateUrl: 'views/admin.createPage.html'
    controller: 'AdminPagesController'
    access:
      requiredLogin: true
  ).when('/admin/pages/edit/:route',
    templateUrl: 'views/admin.editPage.html'
    controller: 'AdminPagesController'
    access:
      requiredLogin: true
  ).when('/admin/files',
    templateUrl: 'views/admin.files.html'
    controller: 'AdminFilesController'
    access:
      requiredLogin: true
  ).when('/admin/files/upload',
    templateUrl: 'views/admin.uploadFile.html'
    controller: 'AdminFilesController'
    access:
      requiredLogin: true
  ).when('/admin/user',
    templateUrl: 'views/admin.user.html'
    controller: 'UserController'
    access:
      requiredLogin: true
  ).when('/blog',
    templateUrl: 'views/blog.html'
    controller: 'BlogController'
    access:
      requiredLogin: false
  ).when('/blog/:id',
    templateUrl: 'views/post.html'
    controller: 'PostController'
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
    console.log $window.sessionStorage.token
    console.log AuthenticationService
    $location.path '/login' if nextRoute.access.requiredLogin and not AuthenticationService.isLogged
    $location.path '/admin' if nextRoute.originalPath in ['/login', '/signup'] and AuthenticationService.isLogged
