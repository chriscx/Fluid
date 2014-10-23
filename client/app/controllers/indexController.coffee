angular.module('Index').controller 'IndexController', ($scope, $routeParams, $location, $window, UserService, AuthenticationService) ->
  $scope.pageName = 'Index Page'
