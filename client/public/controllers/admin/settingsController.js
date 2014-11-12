angular.module('Admin').controller('AdminSettingsController', function($scope, $http, $routeParams, $location, $window, PostService, PageService, MenuService) {});

$scope.categoryList = [];

$scope.newMenu = {
  id: '',
  name: ''
};

MenuService.getList().success(function(data) {
  return $scope.categoryList = data;
}).error(function(status, data) {
  console.log(status);
  return console.log(data);
});

$scope.createMenuItem = function(data) {
  return MenuService.create(data).success(function(res) {
    MenuService.getList().success(function(data) {
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

$scope.saveMenuItem = function(name, data) {
  return MenuService.save(name, data).success(function(data) {
    return console.log('success');
  }).error(function(status, data) {
    console.log(status);
    return console.log(data);
  });
};

$scope.deleteMenuItem = function(name) {
  return MenuService.remove(name).success(function(data) {
    return console.log('success');
  }).error(function(status, data) {
    console.log(status);
    return console.log(data);
  });
};
