angular.module('Index').controller 'IndexController', ($scope, $routeParams, $location, $window, $sce, UserService, AuthenticationService, MenuService, PageService, SettingsService) ->

  $scope.site =
    title: 'Fluid'
    header: ''
    footer: ''

  $scope.isActive = (route) ->
    route = '/' if route == '//'
    $location.path() == route

  MenuService.getList().success((data) ->
    $scope.menu = data
  ).error (status, data) ->
    console.log status
    console.log data

  # SettingsService.get().success((data) ->
  #   $scope.header = data.header
  #   $scope.header.htmlSafe = $sce.trustAsHtml($scope.header.body)
  #   $scope.footer = data.footer
  #   $scope.footer.htmlSafe = $sce.trustAsHtml($scope.footer.body)
  # ).error (status, data) ->
  #   console.log status
  #   console.log data

    $scope.page.htmlSafe =
       $sce.trustAsHtml($scope.page.body)

  # PageService.get('sider').success((data) ->
  #   $scope.sider = data
  #   $scope.sider.htmlSafe = $sce.trustAsHtml($scope.sider.body)
  # ).error (status, data) ->
  #   console.log status
  #   console.log data

  $scope.adminMenu = [
    {id: 'public', name: 'Public', order: 0, route: '/'},
    {id: 'settings', name: 'Settings', order: 1, route: '/#/admin'},
    {id: 'posts', name: 'Posts', order: 2, route: '/#/admin/blog/posts'},
    {id: 'pages', name: 'Pages', order: 3, route: '/#/admin/pages'},
    {id: 'files', name: 'Files', order: 4, route: '/#/admin/files'}
  ]
