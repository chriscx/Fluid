angular.module('Page').factory 'PageService', ->
  remove = ->
    $.del '/page/' + route + '.json', ->
      console.log 'PUT success'

  create = (data) ->
    $.post '/page/' + data.route + '.json', data, ->
      console.log 'POST success'

  save = (data) ->
    oldRoute = data.oldRoute
    delete data.oldRoute
    delete data.new
    delete data._id
    delete data.__v
    delete data.__proto__
    $.put '/page/' + oldRoute + '.json', data, ->
      console.log 'PUT success'
