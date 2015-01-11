# grunt = require 'grunt'
# require('load-grunt-tasks')(grunt)
#
# module.exports = (grunt) ->
#   # Project configuration.
#   grunt.initConfig
#     pkg: grunt.file.readJSON 'package.json'
#     shell:
#       options:
#         stderr: false
#
#       target:
#         command: ['rm -rf server/lib/ client/public/*.js client/public/controllers/ client/public/services/ client/public/views client/public/*.html',
#                   './node_modules/.bin/coffee -b -o client/public/ --no-header -c client/app/',
#                   './node_modules/.bin/jade client/app/views/ -o client/public/views/',
#                   './node_modules/.bin/bower --allow-root install'].join('&&')
#
#   grunt.registerTask 'default', ['shell']
