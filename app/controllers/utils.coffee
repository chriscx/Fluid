markdown = require 'markdown' .markdown

module.exports =
  slugify: (text) ->
    text.toLowerCase
        .replace /\040/g,'-'
        .replace /[^\w-]+/g,''

  convertMarkdown: (markdown) ->
    markdown.toHTML markdown
