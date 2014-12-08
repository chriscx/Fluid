angular.module('Admin').controller('AdminFilesController', function($scope, $http, $routeParams, $location, $window) {
  var err;
  err = function(status, data) {
    if (status >= 400 && data.message === 'jwt expired') {
      return UserService.resetAuth();
    }
  };
  $scope.isActive = function(route) {
    return $location.path() === route;
  };
  return FileService.getList().success(function(data) {
    $scope.fileList = data;
    return console.log('success');
  }).error(function(status, data) {
    err(status, data);
    console.log(status);
    return console.log(data);
  });
});
