angular.module('Site').factory 'Page', ($http) ->

  class Page
    #
    # Constructor: if is not set by the server, it will be overwritten on save
    #
    constructor: (obj) ->
      @id           = if obj.hasOwnProperty('id') then obj.id else null
      @title        = if obj.hasOwnProperty('title') then obj.title else null
      @author       = if obj.hasOwnProperty('author') then obj.author else null
      @body         = if obj.hasOwnProperty('body') then obj.body else null
      @creationDate = if obj.hasOwnProperty('creationDate') then obj.creationDate else null
      @updateDate   = if obj.hasOwnProperty('updateDate') then obj.updateDate else null
      @published    = if obj.hasOwnProperty('published') then obj.published else null

    set: (obj) ->
      @title        = if obj.hasOwnProperty('title') then obj.title else null
      @author       = if obj.hasOwnProperty('author') then obj.author else null
      @body         = if obj.hasOwnProperty('body') then obj.body else null
      @creationDate = if obj.hasOwnProperty('creationDate') then obj.creationDate else null
      @updateDate   = if obj.hasOwnProperty('updateDate') then obj.updateDate else null
      @published    = if obj.hasOwnProperty('published') then obj.published else null

    getInfo: ->
      id:           @id
      title:        @title
      author:       @author
      body:         @body
      creationDate: @creationDate
      updateDate:   @updateDate
      published:    @published

    get: (attribute) ->
      if @.hasOwnProperty(attribute) then @[attribute] else null
