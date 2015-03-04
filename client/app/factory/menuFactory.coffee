angular.module('Blog').factory 'Menu', ($http) ->

  class Menu
    #
    # Constructor: if is not set by the server, it will be overwritten on save
    #
    constructor: (obj) ->
      @id           = if obj.hasOwnProperty('id') then obj.id else null
      @name         = if obj.hasOwnProperty('name') then obj.name else null
      @route        = if obj.hasOwnProperty('route') then obj.route else null
      @description  = if obj.hasOwnProperty('description') then obj.description else null
      @order        = if obj.hasOwnProperty('order') then obj.order else null

    set = (obj) ->
      @name         = if obj.hasOwnProperty('name') then obj.name else null
      @route        = if obj.hasOwnProperty('route') then obj.route else null
      @description  = if obj.hasOwnProperty('description') then obj.description else null
      @order        = if obj.hasOwnProperty('order') then obj.order else null

    getInfo: ->
      id:           @id
      name:         @name
      route:        @route
      description:  @description
      order:        @order

    get: (attribute) ->
      if @.hasOwnProperty(attribute) then @[attribute] else null
