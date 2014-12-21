angular.module('Blog').controller('PostController', function($scope, $http, $routeParams, $location, $window, PostService, MenuService) {
  PostService.get($location.path().slice(6)).success(function(data) {
    $scope.post = data;
    return $scope.post.htmlSafe = $sce.trustAsHtml($scope.post.body);
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
