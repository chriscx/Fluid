angular.module('Admin').controller('AdminFilesController', function($scope, $http, $routeParams, $location, $window, FileService) {
  var err;
  $scope.fileList = [];
  FileService.getList().success(function(data) {
    $scope.fileList = data;
    return console.log('success');
  }).error(function(status, data) {
    return err(status, data);
  });
  err = function(status, data) {
    if (status >= 400 && data.message === 'jwt expired') {
      return UserService.resetAuth();
    }
  };
  $scope.isActive = function(route) {
    return $location.path() === route;
  };
  return $scope.removeFile = function(id) {
    return FileService.remove(id).success(function(data) {
      console.log('success');
      return FileService.getList().success(function(data) {
        $scope.fileList = data;
        return console.log('success');
      }).error(function(status, data) {
        return err(status, data);
      });
    }).error(function(status, data) {
      return err(status, data);
    });
  };
});
