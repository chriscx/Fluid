angular.module('Error').controller 'ErrorController', ($scope, $http, $routeParams, $location, $window, PostService) ->

  errors =
    '404': {title: '', body: '' ,code: ''},
    '500': {title: '', body: '', code: ''},
    '501': {title: '', body: '', code: ''},
    '502': {title: '', body: '', code: ''}

  path = $location.path().split('/')
  if path[2] in errors
    $scope.error = errors[path[2]]
    $scope.error.path = path[3]
  else
    $scope.error = {title: 'Unknown error', body: 'That\'s embarrasing...', path: path[3], code: '?'}
