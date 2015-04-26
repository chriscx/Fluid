angular.module('User').factory 'File', ($http, $location, $window) ->

  class File
    #
    # Constructor: if is not set by the server, it will be overwritten on save
    #
    constructor: (json) ->
      if json?
        @id   = if json.hasOwnProperty('id') then json.id else null
        @path = if json.hasOwnProperty('path') then json.path else null

    set: (obj) ->
      if obj?
        @path = if json.hasOwnProperty('path') then json.path else null

    getInfo: ->
      id:   @id
      path: @path

    get: (attribute) ->
      if @.hasOwnProperty(attribute) then @[attribute] else null
