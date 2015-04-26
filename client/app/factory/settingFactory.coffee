angular.module('Blog').factory 'Settings', ($http) ->

  class Settings
    #
    # Constructor: if is not set by the server, it will be overwritten on save
    #
    constructor: (obj) ->
      @title        = null
      @description  = null
      @keywords     = null
      @author       = null
      @header       = null
      @footer       = null
      if obj?
        for property in obj
          @[attribute] = obj[property]

    set: (obj) ->
      if obj?
        for property in obj
          @[attribute] = obj[property]

    getInfo: ->
      title:        @title
      description:  @description
      keywords:     @keywords
      author:       @author
      header:       @header
      footer:       @footer

    get: (attribute) ->
      if @.hasOwnProperty(attribute) then @[attribute] else null
