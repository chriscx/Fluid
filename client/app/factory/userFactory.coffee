angular.module('User').factory 'UserFactory', ($http, $location, $window, AuthenticationService) ->

  class User
    constructor: (json) ->
      @username = if json.hasOwnProperty('username') then json.username else null
      @email = if json.hasOwnProperty('email') then json.email else null
      @password = if json.hasOwnProperty('password') then json.password else null
      @firstname = if json.hasOwnProperty('firstname') then json.firstname else null
      @lastname = if json.hasOwnProperty('lastname') then json.lastname else null
      @id = if json.hasOwnProperty('id') then json.id else null
