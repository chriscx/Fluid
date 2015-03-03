angular.module('User').factory 'FileFactory', ($http, $location, $window) ->

  class File
    constructor: (json) ->
      @id = if json.hasOwnProperty('id') then json.id else null
      @path = if json.hasOwnProperty('path') then json.path else null
