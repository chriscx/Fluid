FluidApp = angular.module('FluidApp', ['ngRoute', 'ngAnimate', 'textAngular', 'Index', 'User', 'Blog', 'Page', 'Admin'])

angular.module('Index', [])
angular.module('User', [])
angular.module('Blog', [])
angular.module('Page', [])
angular.module('Admin', [])

FluidApp.config ['$locationProvider', '$routeProvider', ($locationProvider, $routeProvider) ->
  $locationProvider.html5Mode true
  $routeProvider.when('/',
    templateUrl: 'views/public.page.html'
    controller: 'PageController'
    access:
      requiredLogin: false
  ).when('/login',
    templateUrl: 'views/public.login.html'
    controller: 'UserController'
    access:
      requiredLogin: false
  ).when('/logout',
    template: ''
    controller: 'LogoutController'
    access:
      requiredLogin: false
  ).when('/signup',
    templateUrl: 'views/public.signup.html'
    controller: 'UserController'
    access:
      requiredLogin: false
  ).when('/forgot',
    templateUrl: 'views/public.forgot.html'
    controller: 'UserController'
    access:
      requiredLogin: false
  ).when('/reset/:token',
    templateUrl: 'views/public.reset.html'
    controller: 'UserController'
    access:
      requiredLogin: false
  ).when('/admin',
    templateUrl: 'views/admin.setting.list.html'
    controller: 'AdminSettingsController'
    access:
      requiredLogin: true
  ).when('/admin/blog/posts',
    templateUrl: 'views/admin.post.list.html'
    controller: 'AdminPostsController'
    access:
      requiredLogin: true
  ).when('/admin/blog/posts/create',
    templateUrl: 'views/admin.post.create.html'
    controller: 'AdminPostsController'
    access:
      requiredLogin: true
  ).when('/admin/blog/posts/edit/:id',
    templateUrl: 'views/admin.editPost.html'
    controller: 'AdminPostsController'
    access:
      requiredLogin: true
  ).when('/admin/pages',
    templateUrl: 'views/admin.page.list.html'
    controller: 'AdminPagesController'
    access:
      requiredLogin: true
  ).when('/admin/pages/create',
    templateUrl: 'views/admin.page.create.html'
    controller: 'AdminPagesController'
    access:
      requiredLogin: true
  ).when('/admin/pages/edit/:route',
    templateUrl: 'views/admin.page.edit.html'
    controller: 'AdminPagesController'
    access:
      requiredLogin: true
  ).when('/admin/files',
    templateUrl: 'views/admin.file.list.html'
    controller: 'AdminFilesController'
    access:
      requiredLogin: true
  ).when('/admin/files/upload',
    templateUrl: 'views/admin.file.upload.html'
    controller: 'AdminFilesController'
    access:
      requiredLogin: true
  ).when('/admin/user',
    templateUrl: 'views/admin.user.html'
    controller: 'UserController'
    access:
      requiredLogin: true
  ).when('/blog',
    templateUrl: 'views/public.blog.html'
    controller: 'BlogController'
    access:
      requiredLogin: false
  ).when('/blog/:id',
    templateUrl: 'views/public.post.html'
    controller: 'PostController'
    access:
      requiredLogin: false
  ).when('/:route',
    templateUrl: 'views/public.page.html'
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
    $location.path '/admin' if nextRoute.originalPath in ['/login', '/signup'] and AuthenticationService.isLogged
