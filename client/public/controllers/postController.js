angular.module('Blog').controller('PostController', function($scope, $http, $routeParams, $location, $sce, $window, PostService, MenuService) {
  return PostService.get($location.path().slice(6)).success(function(data) {
    $scope.post = data;
    return $scope.post.htmlSafe = $sce.trustAsHtml($scope.post.body);
  }).error(function(status, data) {
    console.log(status);
    return console.log(data);
  });
});
