module.exports =
  slugify: (text) ->
    return text
        .toLowerCase
        .replace /\040/g,'-'
        .replace /[^\w-]+/g,''
