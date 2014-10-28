angular.module('Blog').controller('BlogController', function($scope, $http, $routeParams, $location, $window, PostService) {
  $scope.skip = 0;
  $$scope.limit = 7;
  return PostService.getBySlice($scope.skip, $scope.limit).success(function(data) {
    return $scope.posts = data;
  }).error(function(status, data) {
    console.log(status);
    return console.log(data);
  });
});
