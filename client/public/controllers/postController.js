angular.module('Blog').controller('PostController', function($scope, $http, $routeParams, $location, $window) {
  return PostService.get($location.path().slice(6)).success(function(data) {
    return $scope.post = data;
  }).error(function(status, data) {
    console.log(status);
    return console.log(data);
  });
});
