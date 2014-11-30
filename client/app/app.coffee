FluidApp = angular.module('FluidApp', ['ngRoute', 'ngAnimate', 'hc.marked', 'Index', 'User', 'Blog', 'Page', 'Admin'])

angular.module('Index', [])
angular.module('User', [])
angular.module('Blog', [])
angular.module('Page', [])
angular.module('Admin', [])

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
  ).when('/admin',
    templateUrl: 'views/admin/settings.html'
    controller: 'AdminSettingsController'
    access:
      requiredLogin: true
  ).when('/admin/blog',
    templateUrl: 'views/admin/blog/blog.html'
    controller: 'AdminBlogController'
    access:
      requiredLogin: true
  ).when('/admin/blog/posts',
    templateUrl: 'views/admin/blog/posts.html'
    controller: 'AdminPostsController'
    access:
      requiredLogin: true
  ).when('/admin/blog/posts/create',
    templateUrl: 'views/admin/blog/createPost.html'
    controller: 'AdminPostsController'
    access:
      requiredLogin: true
  ).when('/admin/blog/posts/edit/:id',
    templateUrl: 'views/admin/blog/editPost.html'
    controller: 'AdminPostsController'
    access:
      requiredLogin: true
  ).when('/admin/pages',
    templateUrl: 'views/admin/pages/pages.html'
    controller: 'AdminPagesController'
    access:
      requiredLogin: true
  ).when('/admin/pages/create',
    templateUrl: 'views/admin/pages/createPage.html'
    controller: 'AdminPagesController'
    access:
      requiredLogin: true
  ).when('/admin/pages/edit/:route',
    templateUrl: 'views/admin/pages/editPage.html'
    controller: 'AdminPagesController'
    access:
      requiredLogin: true
  ).when('/admin/:user',
    templateUrl: 'views/admin/users/user.html'
    controller: 'UserController'
    access:
      requiredLogin: true
  ).when('/admin/:user/edit',
    templateUrl: 'views/admin/users/userEdit.html'
    controller: 'UserController'
    access:
      requiredLogin: true
  ).when('/blog/',
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
  ).when('/error/:code/:path',
    templateUrl: 'views/error.html'
    controller: 'ErrorController'
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
    console.log nextRoute
    $location.path '/admin/' + $window.sessionStorage.username if nextRoute.originalPath in ['/login', '/signup'] and AuthenticationService.isLogged
