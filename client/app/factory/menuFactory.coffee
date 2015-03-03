angular.module('Blog').factory 'MenuFactory', ($http) ->

  class Menu
    constructor: (json) ->
      @id = if json.hasOwnProperty('id') then json.id else null
      @name = if json.hasOwnProperty('name') then json.name else null
      @route = if json.hasOwnProperty('route') then json.route else null
      @description = if json.hasOwnProperty('description') then json.description else null
      @order = if json.hasOwnProperty('order') then json.order else null
