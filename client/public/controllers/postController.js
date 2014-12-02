angular.module('Blog').controller('PostController', function($scope, $http, $routeParams, $location, $window, PostService, MenuService) {
  var rendered;
  rendered = true;
  PostService.get($location.path().slice(6), rendered).success(function(data) {
    if (data === null) {
      console.log(1);
      return $scope.post = {
        title: '404 Not found',
        author: 'Server',
        creationDate: new Date(),
        body: 'Oh...Sorry but I couldn\'t find this post :/'
      };
    } else {
      return $scope.post = data;
    }
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
    console.log('path: ' + $location.path());
    console.log('route: ' + route);
    $scope.path = $location.path();
    return $location.path() === route;
  };
});
