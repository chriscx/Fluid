angular.module('Admin').controller('AdminBlogController', function($scope, $http, $routeParams, $location, $window, PostService, PageService, CategoryService) {
  $scope.categoryList = [];
  $scope.newCategory = {
    id: '',
    name: ''
  };
  CategoryService.getList().success(function(data) {
    return $scope.categoryList = data;
  }).error(function(status, data) {
    console.log(status);
    return console.log(data);
  });
  $scope.createCategory = function(data) {
    return CategoryService.create(data).success(function(res) {
      CategoryService.getList().success(function(data) {
        return $scope.categoryList = data;
      }).error(function(status, data) {
        console.log(status);
        return console.log(data);
      });
      return console.log('success');
    }).error(function(status, data) {
      console.log(status);
      return console.log(data);
    });
  };
  $scope.saveCategory = function(data) {
    return CategoryService.save(data.id, data).success(function(data) {
      return console.log('success');
    }).error(function(status, data) {
      console.log(status);
      return console.log(data);
    });
  };
  return $scope.deleteCategory = function(name) {
    return CategoryService.remove(name).success(function(data) {
      return console.log('success');
    }).error(function(status, data) {
      console.log(status);
      return console.log(data);
    });
  };
});
