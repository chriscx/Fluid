markdown = require('markdown').markdown
getSlug = require 'speakingurl'

module.exports =

  #
  #    `Slugify text to form nice urls`
  #    ----------------------------
  #
  slugify: (text) ->
    getSlug text

  #
  #    `Convert markdown string into html`
  #    ----------------------------
  #
  convertMarkdown: (markdown) ->
    markdown.toHTML markdown
