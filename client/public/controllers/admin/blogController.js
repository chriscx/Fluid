angular.module('Admin').controller('AdminBlogController', function($scope, $http, $routeParams, $location, $window, PostService, PageService, CategoryService) {
  var err;
  $scope.categoryList = [];
  $scope.newCategory = {
    id: '',
    name: ''
  };
  err = function(status, data) {
    if (status >= 400 && data.message === 'jwt expired') {
      return UserService.resetAuth();
    }
  };
  $scope.isActive = function(route) {
    return $location.path() === route;
  };
  CategoryService.getList().success(function(data) {
    return $scope.categoryList = data;
  }).error(function(status, data) {
    err(status, data);
    console.log(status);
    return console.log(data);
  });
  $scope.createCategory = function(cat) {
    return CategoryService.create(cat).success(function(res) {
      CategoryService.getList().success(function(data) {
        return $scope.categoryList = data;
      }).error(function(status, data) {
        err(status, data);
        console.log(status);
        return console.log(data);
      });
      return console.log('success');
    }).error(function(status, data) {
      err(status, data);
      console.log(status);
      return console.log(data);
    });
  };
  $scope.saveCategory = function(cat) {
    return CategoryService.save(cat.id, data).success(function(data) {
      console.log('success');
      return $location.path('/admin/blog');
    }).error(function(status, data) {
      err(status, data);
      console.log(status);
      return console.log(data);
    });
  };
  return $scope.deleteCategory = function(cat) {
    return CategoryService.remove(cat.id).success(function(data) {
      console.log('success');
      return $location.path('/admin/blog');
    }).error(function(status, data) {
      err(status, data);
      console.log(status);
      return console.log(data);
    });
  };
});
