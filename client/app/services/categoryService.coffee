angular.module('Blog').factory 'CategoryService', ->
  remove = (data) ->
    $.del '/blog/category/' + data.name + '.json', ->
      console.log 'PUT success'

  create = (data) ->
    $.post '/blog/category/' + data.name + '.json', data, ->
      console.log 'POST success'

  save = (data) ->
    $.put '/blog/category/' + data.name + '.json', data, ->
      console.log 'PUT success'
