var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sh = require('shelljs');
var templateCache = require('gulp-angular-templatecache');
var clean = require('gulp-clean');

//for minify js

var uglify = require('gulp-uglify');
var ngmin = require('gulp-ngmin');
var stripDebug = require('gulp-strip-debug');


var paths = {
  sass: ['./scss/**/*.scss'],
  templatecache: ['./www/templates/**/*.html'],
  minifyjs: ['./www/js/**/*.js','!./www/js/dist/main.min.js']
};


//主任务
gulp.task('default', ['clean', 'sass', 'templatecache', 'minifyjs']);


//clean
gulp.task('clean', function() {
    return gulp.src(['./www/js/dist/main.min.js'], {read: false})
        .pipe(clean({force: true}));
});



//js

gulp.task('minifyjs', function() {
    return gulp.src(['./www/js/**/*.js','!./www/js/dist/main.min.js'])
        .pipe(ngmin({dynamic: false}))
//        .pipe(stripDebug())
        .pipe(uglify({outSourceMap: false}))
        .pipe(concat('main.min.js'))
        .pipe(gulp.dest('./www/js/dist'))
});


//sass
gulp.task('sass', function(done) {
  gulp.src('./scss/ionic.app.scss')
    .pipe(sass({
      errLogToConsole: true
    }))
    .pipe(gulp.dest('./www/css/'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./www/css/'))
    .on('end', done);
});

//html template
gulp.task('templatecache', function (done) {
    gulp.src('./www/templates/**/*.html')
        .pipe(templateCache({
            standalone:true,
            base: function(file) {
//            var filename = /[^/]*$/.exec( file.relative )[0];
//            return 'templates/' + filename;
                return 'templates/'+ file.relative;
        }}))
        .pipe(gulp.dest('./www/js/dist'))
        .on('end', done);
});



//watch the change
gulp.task('watch', function() {
  gulp.watch(paths.sass, ['sass']);
  gulp.watch(paths.templatecache, ['templatecache']);
  gulp.watch(paths.minifyjs, ['minifyjs']);
});

gulp.task('install', ['git-check'], function() {
  return bower.commands.install()
    .on('log', function(data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

gulp.task('git-check', function(done) {
  if (!sh.which('git')) {
    console.log(
      '  ' + gutil.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }
  done();
});
