angular.module('Admin').controller('AdminPagesController', function($scope, $http, $routeParams, $location, $window, PostService, PageService, CategoryService) {
  if ($location.path().lastIndexOf('/admin/pages/create', 0) === 0) {
    $scope.page = {
      title: '',
      author: $window.sessionStorage.user.username,
      route: '',
      body: '',
      published: true
    };
    return $scope.createPage = function(data) {
      return PageService.create(data).success(function(data) {
        return console.log('success');
      }).error(function(status, data) {
        console.log(status);
        return console.log(data);
      });
    };
  } else if ($location.path().lastIndexOf('/admin/pages/edit', 0) === 0) {
    PageService.get($location.path().slice(17)).success(function(data) {
      $scope.page = data;
      return $scope.page.ident = $scope.page.route;
    }).error(function(status, data) {
      console.log(status);
      return console.log(data);
    });
    return $scope.savePage = function(route, data) {
      return PageService.save(route, data).success(function(data) {
        return console.log('success');
      }).error(function(status, data) {
        console.log(status);
        return console.log(data);
      });
    };
  } else if ($location.path().lastIndexOf('/admin/pages', 0) === 0) {
    PageService.getList().success(function(data) {
      $scope.pageList = data;
      return $scope.pageList.ident = $scope.pageList.route;
    }).error(function(status, data) {
      console.log(status);
      return console.log(data);
    });
    return $scope.deletePage = function(route) {
      return PageService.remove(route).success(function(data) {
        return console.log('success');
      }).error(function(status, data) {
        console.log(status);
        return console.log(data);
      });
    };
  } else {
    return $location.path('/admin');
  }
});
