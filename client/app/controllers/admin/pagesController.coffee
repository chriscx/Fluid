angular.module('Admin').controller 'AdminPagesController', ($scope, $http, $routeParams, $location, $window, PostService, PageService, CategoryService) ->

  $scope.isActive = (route) ->
    $scope.path = $location.path()
    $location.path() == route

  if $location.path().lastIndexOf('/admin/pages/create', 0) == 0

    $scope.page =
      title: ''
      author: $window.sessionStorage.username
      route: ''
      body: ''
      published: true

    $scope.createPage = (page) ->
      PageService.create(page).success((data) ->
        console.log 'success'
        $location.path '/admin/pages'
      ).error (status, data) ->
        console.log status
        console.log data

  else if $location.path().lastIndexOf('/admin/pages/edit', 0) == 0

    PageService.get($location.path().slice(18)).success((data) ->
      $scope.page = data
      $scope.page.ident = $scope.page.route
      console.log $scope.page
    ).error (status, data) ->
      console.log status
      console.log data

    $scope.savePage = (page) ->
      console.log page
      PageService.save(page.ident, page).success((data) ->
        console.log 'success'
        $location.path '/admin/pages'
      ).error (status, data) ->
        console.log status
        console.log data

    $scope.deletePage = (page) ->
      PageService.remove(page.ident).success((data) ->
        console.log 'success'
        $location.path '/admin/pages'
      ).error (status, data) ->
        console.log status
        console.log data

  else if $location.path().lastIndexOf('/admin/pages', 0) == 0

    PageService.getList().success((data) ->
      $scope.pageList = data
    ).error (status, data) ->
      console.log status
      console.log data

  else
    $location.path '/admin'
