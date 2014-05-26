var FluidApp = angular.module('FluidApp', []);

FluidApp.controller('blogController',function($scope) {

  $.get('/blog/posts/0/5/posts.json', function(data) {
    $scope.$apply(function(){
      $scope.posts = data.content[0];
    });
  });
});
