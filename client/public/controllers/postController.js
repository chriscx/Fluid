angular.module('Blog').controller('PostController', function($scope, $http, $routeParams, $location, $window, PostService) {
  var rendered;
  rendered = true;
  return PostService.get($location.path().slice(6), rendered).success(function(data) {
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
});
