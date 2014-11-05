angular.module('Page').controller('PageController', function($scope, $http, $routeParams, $location, $window, PageService) {
  console.log($location.path().slice(1));
  return PageService.get($location.path().slice(1)).success(function(data) {
    if (data.length < 1) {
      return $scope.page = {
        title: '404 Not found',
        body: 'Oh...Sorry but I couldn\'t find this page :/'
      };
    } else {
      return $scope.page = data[0];
    }
  }).error(function(status, data) {
    console.log(status);
    return console.log(data);
  });
});