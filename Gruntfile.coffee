grunt = require 'grunt'
require('load-grunt-tasks')(grunt)

module.exports = (grunt) ->

  grunt.loadNpmTasks 'grunt-contrib-jade'
  grunt.loadNpmTasks 'grunt-contrib-coffee'
  grunt.loadNpmTasks 'grunt-mocha-test'

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
                  './node_modules/.bin/jade client/app/*.jade -o client/public/',
                  './node_modules/.bin/jade client/app/views/*.jade -o client/public/views/',
                  './node_modules/.bin/jade client/app/views/admin/*.jade -o client/public/views/admin',
                  './node_modules/.bin/jade client/app/views/admin/blog/*.jade -o client/public/views/admin/blog',
                  './node_modules/.bin/jade client/app/views/admin/pages/*.jade -o client/public/views/admin/pages',
                  './node_modules/.bin/jade client/app/views/admin/users/*.jade -o client/public/views/admin/users',
                  './node_modules/.bin/jade client/app/views/admin/files/*.jade -o client/public/views/admin/files',
                  './node_modules/.bin/bower install'].join('&&')

    # jade:
    #   compile:
    #     options:
    #
    #       data:
    #         debug: false
    #     files:
    #       'client/public/': ['client/app/*.jade']
    #       'client/public/views/': ['client/app/views/*.jade']
    #       'client/public/views/admin': ['client/app/views/admin/*.jade']
    #       'client/public/views/admin/blog': ['client/app/views/admin/blog/*.jade']
    #       'client/public/views/admin/pages': ['client/app/views/admin/pages/*.jade']
    #       'client/public/views/admin/users': ['client/app/views/admin/users/*.jade']
    #
    # coffee:
    #   app:
    #     src: ['server/app/']
    #     dest: 'server/lib/'
    #   client:
    #       src: ['client/app/']
    #       dest: 'client/public/'
    #
    #
    # mochaTest:
    #   test:
    #     options:
    #       reporter: 'spec'
    #       require: 'coffee-script/register'
    #       quiet: false
    #     src: [ 'server/test*.js' ]

  grunt.registerTask 'default', ['shell']
