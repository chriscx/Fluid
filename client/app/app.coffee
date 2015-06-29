FluidApp = angular.module('FluidApp', ['ngRoute', 'ngAnimate', 'textAngular', 'Index', 'Users', 'Blog', 'Site', 'Admin', 'Auth'])

angular.module('Index', [])
angular.module('Blog', [])
angular.module('Site', [])

FluidApp.config ['$locationProvider', '$routeProvider', ($locationProvider, $routeProvider) ->
  $locationProvider.html5Mode true
  $routeProvider.when('/',
    templateUrl: 'views/public.home.html'
    controller: 'PageController'
    access:
      requiredLogin: false
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
  ).when('/:id',
    templateUrl: 'views/public.page.html'
    controller: 'PageController'
    access:
      requiredLogin: false
  ).otherwise redirectTo: '/'
  return
]
