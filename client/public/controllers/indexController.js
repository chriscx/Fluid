angular.module('Index').controller('IndexController', function($scope, $routeParams, $location, $window, $sce, UserService, AuthenticationService, MenuService, PageService, SettingService) {
  $scope.site = {
    title: 'Fluid',
    header: '',
    footer: ''
  };
  $scope.isActive = function(route) {
    if (route === '//') {
      route = '/';
    }
    return $location.path() === route;
  };
  MenuService.getList().success(function(data) {
    return $scope.menu = data;
  }).error(function(status, data) {
    console.log(status);
    return console.log(data);
  });
  SettingService.get().success(function(data) {
    console.log(data);
    $scope.title = data.title;
    $scope.header = data.header;
    $scope.header.htmlSafe = $sce.trustAsHtml($scope.header.body);
    $scope.footer = data.footer;
    $scope.footer.htmlSafe = $sce.trustAsHtml($scope.footer.body);
    console.log($scope.header.htmlSafe);
    return console.log($scope.footer.htmlSafe);
  }).error(function(status, data) {
    console.log(status);
    console.log(data);
    return $scope.page.htmlSafe = $sce.trustAsHtml($scope.page.body);
  });
  return $scope.adminMenu = [
    {
      id: 'public',
      name: 'Public',
      order: 0,
      route: '/'
    }, {
      id: 'settings',
      name: 'Settings',
      order: 1,
      route: '/#/admin'
    }, {
      id: 'posts',
      name: 'Posts',
      order: 2,
      route: '/#/admin/blog/posts'
    }, {
      id: 'pages',
      name: 'Pages',
      order: 3,
      route: '/#/admin/pages'
    }, {
      id: 'files',
      name: 'Files',
      order: 4,
      route: '/#/admin/files'
    }
  ];
});
