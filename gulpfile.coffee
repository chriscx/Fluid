gulp        = require 'gulp'
jade        = require 'gulp-jade'
coffee      = require 'gulp-coffee'
concat      = require 'gulp-concat'
gutil       = require 'gulp-util'

paths =
  jade:
    src: './client/app/**/*.jade'
    dest: './client/public/'

  coffee_client:
    src: './client/app/**/*.coffee'
    dest: './client/public/'

gulp.task 'default', ['jade', 'coffee']

gulp.task 'jade', ->
  gulp.src paths.jade.src
    .pipe jade()
    .pipe gulp.dest paths.jade.dest

gulp.task 'coffee', ->
  gulp.src paths.coffee_client.src
    .pipe(coffee(bare: true).on('error', gutil.log))
    .pipe(concat('app.js'))
    .pipe gulp.dest paths.coffee_client.dest

gulp.task 'watch', ->
  gulp.watch(paths.jade.src, [ 'jade' ]).on 'change', (event) ->
    console.log 'File ' + event.path + ' was ' + event.type + ', rendering...'
  gulp.watch(paths.coffee_client.src, [ 'coffee' ]).on 'change', (event) ->
    console.log 'File ' + event.path + ' was ' + event.type + ', rendering...'
