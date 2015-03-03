angular.module('Blog').factory 'SettingFactory', ($http) ->

  class Setting
    constructor: (json) ->
      @title = if json.hasOwnProperty('username') then json.username else null
      @description = if json.hasOwnProperty('description') then json.description else null
      @keywords = if json.hasOwnProperty('keywords') then json.keywords else null
      @author = if json.hasOwnProperty('author') then json.author else null
      @header = if json.hasOwnProperty('header') then json.header else null
      @footer = if json.hasOwnProperty('footer') then json.footer else null
