angular.module('Blog').factory 'PostFactory', ($http) ->

  class Post
    constructor: (json) ->
      @title = if json.hasOwnProperty('title') then json.title else null
      @author = if json.hasOwnProperty('author') then json.author else null
      @id = if json.hasOwnProperty('id') then json.id else null
      @body = if json.hasOwnProperty('body') then json.body else null
      @tags = if json.hasOwnProperty('tags') then json.tags else null
      @category = if json.hasOwnProperty('category') then json.category else null
      @comments = if json.hasOwnProperty('comments') then json.comments else null
      @creationDate = if json.hasOwnProperty('creationDate') then json.creationDate else null
      @updateDate = if json.hasOwnProperty('updateDate') then json.updateDate else null
      @published = if json.hasOwnProperty('published') then json.published else null
