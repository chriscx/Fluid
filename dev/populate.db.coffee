should = require 'should'
mongoose = require 'mongoose'
Entry = require('../app/models/blog').Entry
Page = require('../app/models/page').Page

utils = require '../app/controllers/utils'

mongoose.connect('mongodb://localhost/fluiddb_dev');


for i in [1..10] by 1
  do (i) ->
    newPost = new Entry(
      title: 'title ' + i
      author: 'author'
      id: utils.slugify('title ' + i)
      body: 'This is a test post'
      tags: [{name: 'tag1'}]
      category: 'test'
      comments: []
      creationDate: (new Date()).getTime() + (i * 24 * 60 * 60 * 1000)
      updateDate: null
      published: true
    )
    newPost.save (err) ->
      throw err if err

for i in [1..10] by 1
  do (i) ->
    newPage = new Page(
      title: 'title ' + i
      route: utils.slugify('title ' + i)
      author: 'author'
      id: utils.slugify('title ' + i)
      body: 'This is a test page'
      creationDate: (new Date()).getTime() + (i * 24 * 60 * 60 * 1000)
      updateDate: null
      published: true
    )
    newPage.save (err) ->
      throw err if err
