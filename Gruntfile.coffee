grunt = require 'grunt'
require('load-grunt-tasks')(grunt)

module.exports = (grunt) ->
  # Project configuration.
  grunt.initConfig
    pkg: grunt.file.readJSON 'package.json'
    shell:
      options:
        stderr: false

      target:
        command: ['rm -rf server/lib/ client/public/*.js client/public/controllers/ client/public/services/ client/public/views client/public/*.html && mkdir server/lib',
                  './node_modules/.bin/coffee -b -o server/lib/ --no-header -c server/app/',
                  './node_modules/.bin/coffee -b -o client/public/ --no-header -c client/app/',
                  './node_modules/.bin/jade -P client/app/*.jade -o client/public/',
                  './node_modules/.bin/jade client/app/views/*.jade -o client/public/views/',
                  './node_modules/.bin/jade client/app/views/admin/*.jade -o client/public/views/admin',
                  './node_modules/.bin/jade client/app/views/admin/blog/*.jade -o client/public/views/admin/blog',
                  './node_modules/.bin/jade client/app/views/admin/pages/*.jade -o client/public/views/admin/pages',
                  './node_modules/.bin/jade client/app/views/admin/users/*.jade -o client/public/views/admin/users',
                  './node_modules/.bin/jade client/app/views/admin/files/*.jade -o client/public/views/admin/files',
                  './node_modules/.bin/bower --allow-root install'].join('&&')

  grunt.registerTask 'default', ['shell']
