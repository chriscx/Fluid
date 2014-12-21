angular.module('Page').controller('PageController', function($scope, $http, $routeParams, $location, $window, $sce, PageService, MenuService) {
  $scope.page = {};
  if ($location.path() === '/') {
    PageService.get('index').success(function(data) {
      $scope.page = data;
      return $scope.page.htmlSafe = $sce.trustAsHtml($scope.page.body);
    }).error(function(status, data) {
      console.log(status);
      return console.log(data);
    });
  } else {
    console.log($location.path().slice(1));
    PageService.get($location.path().slice(1)).success(function(data) {
      $scope.page = data;
      return $scope.page.htmlSafe = $sce.trustAsHtml($scope.page.body);
    }).error(function(status, data) {
      console.log(status);
      return console.log(data);
    });
  }
  MenuService.getList().success(function(data) {
    return $scope.menu = data;
  }).error(function(status, data) {
    console.log(status);
    return console.log(data);
  });
  return $scope.isActive = function(route) {
    if (route === '//') {
      route = '/';
    }
    return $location.path() === route;
  };
});
