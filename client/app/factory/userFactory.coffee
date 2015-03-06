angular.module('Users').factory 'User', ($http, $location, $window, AuthenticationService) ->

  class User
    #
    # Constructor: if is not set by the server, it will be overwritten on save
    #
    constructor: (obj) ->
      @username   = if obj.hasOwnProperty('username') then obj.username else null
      @email      = if obj.hasOwnProperty('email') then obj.email else null
      @password   = if obj.hasOwnProperty('password') then obj.password else null
      @firstname  = if obj.hasOwnProperty('firstname') then obj.firstname else null
      @lastname   = if obj.hasOwnProperty('lastname') then obj.lastname else null

    set: (obj) ->
      @username   = if obj.hasOwnProperty('username') then obj.username else null
      @email      = if obj.hasOwnProperty('email') then obj.email else null
      @password   = if obj.hasOwnProperty('password') then obj.password else null
      @firstname  = if obj.hasOwnProperty('firstname') then obj.firstname else null
      @lastname   = if obj.hasOwnProperty('lastname') then obj.lastname else null

    getInfo: ->
      username:   @username
      email:      @email
      firstname:  @firstname
      lastname:   @lastname

    get: (attribute) ->
      if @.hasOwnProperty(attribute) and attribute != 'password' then @[attribute] else null
