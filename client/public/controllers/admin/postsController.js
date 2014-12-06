angular.module('Admin').controller('AdminPostsController', function($scope, $http, $routeParams, $location, $window, PostService, PageService, CategoryService) {
  $scope.isActive = function(route) {
    $scope.path = $location.path();
    return $location.path() === route;
  };
  $scope.postList = [];
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
    return $scope.createPost = function(post) {
      return PostService.create(post).success(function(data, status, headers, config) {
        console.log('success');
        return $location.path('/admin/blog/posts');
      }).error(function(data, status, headers, config) {
        console.log(status);
        return console.log(data);
      });
    };
  } else if ($location.path().lastIndexOf('/admin/blog/posts/edit', 0) === 0) {
    PostService.get($location.path().slice(23)).success(function(data) {
      $scope.post = data;
      return $scope.post.ident = $scope.post.id;
    }).error(function(data, status, headers, config) {
      console.log(status);
      return console.log(data);
    });
    CategoryService.getList().success(function(data) {
      console.log(data);
      return $scope.categories = data;
    }).error(function(data, status, headers, config) {
      console.log(status);
      return console.log(data);
    });
    $scope.savePost = function(post) {
      return PostService.save(post.ident, post).success(function(data) {
        console.log('success');
        return $location.path('/admin/blog/posts');
      }).error(function(data, status, headers, config) {
        console.log(status);
        return console.log(data);
      });
    };
    return $scope.deletePost = function(post) {
      return PostService.remove(post.ident).success(function(data) {
        console.log('success');
        return $location.path('/admin/blog/posts');
      }).error(function(data, status, headers, config) {
        console.log(status);
        return console.log(data);
      });
    };
  } else if ($location.path().lastIndexOf('/admin/blog/posts', 0) === 0) {
    return PostService.getList().success(function(data) {
      $scope.postList = data;
      return console.log($scope.postList);
    }).error(function(data, status, headers, config) {
      console.log(status);
      return console.log(data);
    });
  } else {
    return $location.path('/admin');
  }
});
