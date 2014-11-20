angular.module('Admin').controller('AdminPagesController', function($scope, $http, $routeParams, $location, $window, PostService, PageService, CategoryService) {
  $scope.isActive = function(route) {
    $scope.path = $location.path();
    return $location.path() === route;
  };
  if ($location.path().lastIndexOf('/admin/pages/create', 0) === 0) {
    $scope.page = {
      title: '',
      author: $window.sessionStorage.username,
      route: '',
      body: '',
      published: true
    };
    return $scope.createPage = function(page) {
      return PageService.create(page).success(function(data) {
        console.log('success');
        return $location.path('/admin/pages');
      }).error(function(status, data) {
        console.log(status);
        return console.log(data);
      });
    };
  } else if ($location.path().lastIndexOf('/admin/pages/edit', 0) === 0) {
    PageService.get($location.path().slice(18)).success(function(data) {
      $scope.page = data;
      $scope.page.ident = $scope.page.route;
      return console.log($scope.page);
    }).error(function(status, data) {
      console.log(status);
      return console.log(data);
    });
    $scope.savePage = function(page) {
      return PageService.save(page.ident, page).success(function(data) {
        console.log('success');
        return $location.path('/admin/pages');
      }).error(function(status, data) {
        console.log(status);
        return console.log(data);
      });
    };
    return $scope.deletePage = function(page) {
      return PageService.remove(page.ident).success(function(data) {
        console.log('success');
        return $location.path('/admin/pages');
      }).error(function(status, data) {
        console.log(status);
        return console.log(data);
      });
    };
  } else if ($location.path().lastIndexOf('/admin/pages', 0) === 0) {
    return PageService.getList().success(function(data) {
      return $scope.pageList = data;
    }).error(function(status, data) {
      console.log(status);
      return console.log(data);
    });
  } else {
    return $location.path('/admin');
  }
});
