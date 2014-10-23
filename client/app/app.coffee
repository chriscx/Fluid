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
  ).when('/u/:user/edit',
    templateUrl: 'views/user.html'
    controller: 'UserController'
    access:
      requiredLogin: true
  ).otherwise redirectTo: '/'
  return
]

FluidApp.config ($httpProvider) ->
  $httpProvider.interceptors.push "authInterceptor"

  signUp: (username, password, email, firstname, lastname, country) ->
    $http.post '/signup',
      username: username
      password: password
      email: email
      firstname: firstname
      lastname: lastname
      country: country


FluidApp.run ($rootScope, $location, $window, AuthenticationService) ->
  $rootScope.$on '$routeChangeStart', (event, nextRoute, currentRoute) ->
    $location.path '/login' if nextRoute.access.requiredLogin and not AuthenticationService.isLogged
    $location.path '/u/' + $window.session.user.username if nextRoute in ['/login', '/signup'] and AuthenticationService.isLogged
