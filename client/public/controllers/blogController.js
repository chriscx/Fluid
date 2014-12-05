angular.module('Blog').controller('BlogController', function($scope, $http, $routeParams, $location, $window, PostService, MenuService) {
  $scope.skip = 0;
  $scope.limit = 7;
  PostService.getBySlice($scope.skip, $scope.limit).success(function(data) {
    console.log(data);
    return $scope.posts = data;
  }).error(function(status, data) {
    console.log(status);
    return console.log(data);
  });
  MenuService.getList().success(function(data) {
    return $scope.menu = data;
  }).error(function(status, data) {
    console.log(status);
    return console.log(data);
  });
  return $scope.isActive = function(route) {
    return $location.path() === route;
  };
});
