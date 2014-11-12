angular.module('Admin').controller 'AdminPagesController', ($scope, $http, $routeParams, $location, $window, PostService, PageService, CategoryService) ->

  if $location.path().lastIndexOf('/admin/pages/create', 0) == 0

    $scope.page =
      title: ''
      author: $window.sessionStorage.username
      route: ''
      body: ''
      published: true

    $scope.createPage = (data) ->
      PageService.create(data).success((data) ->
        console.log 'success'
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

    $scope.savePage = (route, data) ->
      delete data.ident
      PageService.save(route, data).success((data) ->
        console.log 'success'
      ).error (status, data) ->
        console.log status
        console.log data

  else if $location.path().lastIndexOf('/admin/pages', 0) == 0

    PageService.getList().success((data) ->
      $scope.pageList = data
    ).error (status, data) ->
      console.log status
      console.log data

    $scope.deletePage = (route) ->
      PageService.remove(route).success((data) ->
        console.log 'success'
      ).error (status, data) ->
        console.log status
        console.log data

  else
    $location.path '/admin'
