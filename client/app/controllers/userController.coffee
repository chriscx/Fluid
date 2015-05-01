angular.module('Users').controller 'UserController', ($scope, $http, $routeParams, $location, $window, UserService, AuthenticationService, MenuService) ->

  $scope.update = (user) ->
    if user.username isnt `undefined` and user.username isnt '' and
      user.email isnt `undefined` and user.email isnt ''
        del user.password if user.password is ''
        UserService.updateUserData(user.username, user).success((data) ->
          console.log 'success'
        ).error (status, data) ->
          console.log status
          console.log data
