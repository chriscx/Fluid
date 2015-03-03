angular.module('Page').factory 'PageFactory', ($http) ->

  class Page
    constructor: (json) ->
      @title = if json.hasOwnProperty('title') then json.title else null
      @author = if json.hasOwnProperty('author') then json.author else null
      @route = if json.hasOwnProperty('route') then json.route else null
      @body = if json.hasOwnProperty('body') then json.body else null
      @creationDate = if json.hasOwnProperty('creationDate') then json.creationDate else null
      @updateDate = if json.hasOwnProperty('updateDate') then json.updateDate else null
      @published = if json.hasOwnProperty('published') then json.published else null
