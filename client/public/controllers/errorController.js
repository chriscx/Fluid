var __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

angular.module('Error').controller('ErrorController', function($scope, $http, $routeParams, $location, $window, PostService) {
  var errors, path, _ref;
  errors = {
    '404': {
      title: '',
      body: '',
      code: ''
    },
    '500': {
      title: '',
      body: '',
      code: ''
    },
    '501': {
      title: '',
      body: '',
      code: ''
    },
    '502': {
      title: '',
      body: '',
      code: ''
    }
  };
  path = $location.path().split('/');
  if (_ref = path[2], __indexOf.call(errors, _ref) >= 0) {
    $scope.error = errors[path[2]];
    return $scope.error.path = path[3];
  } else {
    return $scope.error = {
      title: 'Unknown error',
      body: 'That\'s embarrasing...',
      path: path[3],
      code: '?'
    };
  }
});
