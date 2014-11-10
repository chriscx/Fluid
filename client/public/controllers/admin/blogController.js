angular.module('Admin').controller('AdminBlogController', function($scope, $http, $routeParams, $location, $window, PostService, PageService, CategoryService) {
  $scope.categoryList = [];
  CategoryService.getList().success(function(data) {
    $scope.categoryList = data;
    return $scope.categoryList.ident = $scope.categoryList.name;
  }).error(function(status, data) {
    console.log(status);
    return console.log(data);
  });
  $scope.createCategory = function(data) {
    return CategoryService.create(data).success(function(data) {
      $scope.categoryList.concat(data);
      console.log($scope.categoryList);
      $scope.newCategory.name = '';
      return console.log('success');
    }).error(function(status, data) {
      console.log(status);
      return console.log(data);
    });
  };
  $scope.saveCategory = function(name, data) {
    return CategoryService.save(name, data).success(function(data) {
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
