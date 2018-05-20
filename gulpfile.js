var path = require('path');
var fs = require('fs');
var gulp = require('gulp');
var less = require('gulp-less');
var header = require('gulp-header');
var tap = require('gulp-tap');
var nano = require('gulp-cssnano');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var comments = require('postcss-discard-comments');
var rename = require('gulp-rename');
var sourcemaps = require('gulp-sourcemaps');
var browserSync = require('browser-sync');
var clean   = require('gulp-clean');
var del = require('del');
var vinylPaths = require('vinyl-paths');
var runSequence = require('gulp-run-sequence');
var stripDebug = require('gulp-strip-debug');
var gulpif = require('gulp-if');
var gulpMultiProcess = require('gulp-multi-process');
var babel = require("gulp-babel");
var plumber = require('gulp-plumber');
var pkg = require('./package.json');
var fileinclude = require('gulp-file-include'); // 模版复用
var yargs = require('yargs').options({
  w: {
    alias: 'watch',
    type: 'boolean'
  },
  s: {
    alias: 'server',
    type: 'boolean'
  },
  p: {
    alias: 'port',
    type: 'number'
  }
}).argv;

var option = { base: 'src' };
var dist = __dirname + '/dist';

gulp.task('build:style', function() {
  var banner = [
    '/*!',
    ' * kewo style v<%= pkg.version %> (<%= pkg.homepage %>)',
    ' * Copyright <%= new Date().getFullYear() %>',
    ' * Licensed under the <%= pkg.license %> license',
    ' */',
    ''
  ].join('\n');
  return gulp
    .src('src/style/index.less', option)
    .pipe(sourcemaps.init())
    .pipe(
      less().on('error', function(e) {
        console.error(e.message);
        this.emit('end');
      })
    )
    // .pipe(postcss([autoprefixer(['iOS >= 7', 'Android >= 4.1']), comments()]))
    .pipe(header(banner, { pkg: pkg }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(dist))
    .pipe(browserSync.reload({ stream: true }))
    .pipe(
      nano({
        zindex: false,
        autoprefixer: false
      })
    )
    .pipe(
      rename(function(path) {
        path.basename += '.min';
      })
    )
    .pipe(gulp.dest(dist));
});

gulp.task('build:img', function() {
  return gulp
    .src(['src/img/**/*.?(png|jpg|gif)', 'src/style/fonts/*.*'], option)
    .pipe(gulp.dest(dist))
    .pipe(browserSync.reload({ stream: true }));
});

gulp.task('build:staticjs', function () {
  return gulp
    .src(['src/js/static/*.js'], option)
    .pipe(gulp.dest(dist))
    .pipe(browserSync.reload({ stream: true }));
})

gulp.task('build:js', function() {
  return gulp
    .src(['src/js/**/*.js', '!src/js/static/*.js', 'src/page/**/*.js'], option)
    .pipe(plumber())
    .pipe(babel())
    .pipe(gulp.dest(dist))
    .pipe(browserSync.reload({ stream: true }));
});

gulp.task('build:page', function() {
  return gulp
    .src(['src/page/**/*.html', '!src/page/layout/**/*.html'], option)
    .pipe(fileinclude({
      prefix: '@@',
      basepath: '@file',
      index: true
    }))
    .pipe(gulp.dest(dist))
    .pipe(browserSync.reload({ stream: true }));
});

gulp.task('build', [
  'build:img',
  'build:js',
  'build:staticjs',
  'build:style',
  'build:page'
]);

gulp.task('watch', function() {
  gulp.watch('src/img/**/*.?(png|jpg|gif)', ['build:img']);
  gulp.watch(['src/js/**/*.js', '!src/js/static/*.js', 'src/page/**/*.js'], ['build:js']);
  gulp.watch('src/**/*.?(html|json)', ['build:page']);
  gulp.watch('src/style/**/index.less', ['build:style']);
});

gulp.task('server', function() {
  yargs.p = yargs.p || 8080;
  browserSync.init({
    server: {
      baseDir: './dist'
    },
    ui: {
      port: yargs.p + 1,
      weinre: {
        port: yargs.p + 2
      }
    },
    port: yargs.p,
    startPath: 'page/index.html'
  });
});

gulp.task('del', function() {
  return gulp
    .src('./dist')
    .pipe(stripDebug())
    .pipe(vinylPaths(del));
})

// 参数说明
//  -w: 实时监听
//  -s: 启动服务器
//  -p: 服务器启动端口，默认8080
gulp.task('default', function(cb) {
  runSequence('del', 'build', function() {
    if (yargs.s) {
      gulp.start('server');
    }

    if (yargs.w) {
      gulp.start('watch');
    }
  })

});
