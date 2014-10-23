markdown = require('markdown').markdown
getSlug = require 'speakingurl'

module.exports =

  slugify: (text) ->
    getSlug text
    
  convertMarkdown: (markdown) ->
    markdown.toHTML markdown
