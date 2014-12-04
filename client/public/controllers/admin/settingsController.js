angular.module('Admin').controller('AdminSettingsController', function($scope, $http, $routeParams, $location, $window, PostService, PageService, MenuService) {
  $scope.categoryList = [];
  $scope.menuList = [];
  $scope.newMenu = {
    id: '',
    name: '',
    route: ''
  };
  $scope.isActive = function(route) {
    $scope.path = $location.path();
    return $location.path() === route;
  };
  MenuService.getList().success(function(data) {
    $scope.menuList = data;
    return console.log('success');
  }).error(function(status, data) {
    console.log(status);
    return console.log(data);
  });
  $scope.createMenuItem = function(data) {
    console.log('click');
    return MenuService.create(data).success(function(res) {
      MenuService.getList().success(function(data) {
        return $scope.menuList = data;
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
  $scope.saveMenuItem = function(data) {
    return MenuService.save(data.id, data).success(function(data) {
      return console.log('success');
    }).error(function(status, data) {
      console.log(status);
      return console.log(data);
    });
  };
  return $scope.deleteMenuItem = function(data) {
    return MenuService.remove(data.id).success(function(data) {
      return MenuService.getList().success(function(data) {
        return $scope.menuList = data;
      }).error(function(status, data) {
        console.log(status);
        return console.log(data);
      });
    }).error(function(status, data) {
      console.log(status);
      return console.log(data);
    });
  };
});
