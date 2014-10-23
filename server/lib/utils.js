var getSlug, markdown;

markdown = require('markdown').markdown;

getSlug = require('speakingurl');

module.exports = {
  slugify: function(text) {
    return getSlug(text);
  },
  convertMarkdown: function(markdown) {
    return markdown.toHTML(markdown);
  }
};
