angular.module('Blog').factory 'PostService', ->

  create = (data) ->
    $.post '/blog/post/' + getSlug(data.title) + '.json', data, ->
      console.log 'POST success'

  save = (data) ->
    oldSlug = data.oldSlug
    data.slug = getSlug(data.title)
    delete data.oldSlug
    delete data.new
    delete data._id
    delete data.__v
    delete data.__proto__
    console.log data
    console.log '/blog/post/' + oldSlug + '.json'
    $.put '/blog/post/' + oldSlug + '.json', data, ->
      console.log 'PUT success'

  remove = (data) ->
    $.del '/blog/post/' + getSlug(data.title) + '.json', ->
      console.log 'DEL success'
