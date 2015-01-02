angular.module('Admin').controller('AdminSettingsController', function($scope, $http, $routeParams, $location, $window, MenuService, SettingService) {
  var err;
  $scope.categoryList = [];
  $scope.menuList = [];
  $scope.newMenu = {
    id: '',
    name: '',
    route: ''
  };
  $scope.settings = {
    title: 'Fluid',
    header: {
      content: 'Fluid\n=======',
      body: ''
    },
    footer: {
      content: '',
      body: ''
    }
  };
  err = function(status, data) {
    if (status >= 400 && data.message === 'jwt expired') {
      return UserService.resetAuth();
    }
  };
  $scope.isActive = function(route) {
    return $location.path() === route;
  };
  SettingService.get().success(function(data) {
    return $scope.settings = data;
  }).error(function(status, data) {
    console.log(status);
    return console.log(data);
  });
  $scope.saveSettings = function(data) {
    return SettingService.save(data).success(function(res) {
      return console.log('success');
    }).error(function(status, data) {
      err(status, data);
      console.log(status);
      return console.log(data);
    });
  };
  MenuService.getList().success(function(data) {
    return $scope.menuList = data;
  }).error(function(status, data) {
    err(status, data);
    console.log(status);
    return console.log(data);
  });
  $scope.createMenuItem = function(data) {
    console.log('click');
    return MenuService.create(data).success(function(res) {
      MenuService.getList().success(function(data) {
        return $scope.menuList = data;
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
  $scope.saveMenuItem = function(data) {
    return MenuService.save(data.id, data).success(function(data) {}).error(function(status, data) {
      err(status, data);
      console.log(status);
      return console.log(data);
    });
  };
  return $scope.deleteMenuItem = function(data) {
    return MenuService.remove(data.id).success(function(data) {
      return MenuService.getList().success(function(data) {
        return $scope.menuList = data;
      }).error(function(status, data) {
        err(status, data);
        console.log(status);
        return console.log(data);
      });
    }).error(function(status, data) {
      err(status, data);
      console.log(status);
      return console.log(data);
    });
  };
});
