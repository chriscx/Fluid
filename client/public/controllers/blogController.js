angular.module('Blog').controller('BlogController', function($scope, $http, $routeParams, $location, $window, PostService, MenuService) {
  $scope.skip = 0;
  $scope.limit = 5;
  PostService.getBySlice($scope.skip, $scope.limit).success(function(data) {
    console.log(data);
    if (data.length !== 0) {
      return $scope.posts = data;
    }
  }).error(function(status, data) {
    console.log(status);
    return console.log(data);
  });
  $scope.getNext = function() {
    $scope.skip += 5;
    $scope.limit += 5;
    return PostService.getBySlice($scope.skip, $scope.limit).success(function(data) {
      console.log(data);
      if (data.length !== 0) {
        return $scope.posts = data;
      }
    }).error(function(status, data) {
      console.log(status);
      return console.log(data);
    });
  };
  $scope.getPrevious = function() {
    $scope.skip -= 5;
    $scope.limit -= 5;
    return PostService.getBySlice($scope.skip, $scope.limit).success(function(data) {
      console.log(data);
      if (data.length !== 0) {
        return $scope.posts = data;
      }
    }).error(function(status, data) {
      console.log(status);
      return console.log(data);
    });
  };
  return $scope.navIsActive = function() {
    if ($scope.skip === 0) {
      return true;
    } else {
      return false;
    }
  };
});
