angular.module('Page').controller('PageController', function($scope, $http, $routeParams, $location, $window) {
  return $.get('/blog/posts/0/5/posts.json', function(data) {
    console.log(data);
    return $scope.$apply(function() {
      return $scope.posts = data.entries;
    });
  });
});
