angular.module('Admin').controller('AdminPostsController', function($scope, $http, $routeParams, $location, $window, PostService, PageService, CategoryService) {
  console.log($window.sessionStorage.token);
  console.log($window.sessionStorage.username);
  if ($location.path().lastIndexOf('/admin/blog/posts/create', 0) === 0) {
    $scope.post = {
      title: '',
      author: $window.sessionStorage.username,
      body: '',
      tags: [],
      category: '',
      comments: [],
      published: true
    };
    return $scope.createPost = function(data) {
      return PostService.create(data).success(function(data) {
        return console.log('success');
      }).error(function(status, data) {
        console.log(status);
        return console.log(data);
      });
    };
  } else if ($location.path().lastIndexOf('/admin/blog/posts/edit', 0) === 0) {
    PostService.get($location.path().slice(22)).success(function(data) {
      $scope.post = data;
      return $scope.post.ident = $scope.post.id;
    }).error(function(status, data) {
      console.log(status);
      return console.log(data);
    });
    return $scope.savePost = function(id, data) {
      return PostService.save(id, data).success(function(data) {
        return console.log('success');
      }).error(function(status, data) {
        console.log(status);
        return console.log(data);
      });
    };
  } else if ($location.path().lastIndexOf('/admin/blog/posts', 0) === 0) {
    PostService.getList().success(function(data) {
      $scope.postList = data;
      return console.log($scope.postList);
    }).error(function(status, data) {
      console.log(status);
      return console.log(data);
    });
    return $scope.deletePost = function(id) {
      return PostService.remove(id).success(function(data) {
        return $console.log('success');
      }).error(function(status, data) {
        console.log(status);
        return console.log(data);
      });
    };
  } else {
    return $location.path('/admin');
  }
});
