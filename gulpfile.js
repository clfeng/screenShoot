var gulp = require('gulp');
var jsmin = require('gulp-jsmin');
var rename = require('gulp-rename');
var cleanCSS = require('gulp-clean-css');
var browserSync = require('browser-sync');


gulp.task('server',function (){
  browserSync.init({
    "server":"./src/",
    "port":"3500",
    "files":[
      "./*.html",
      "./css/*.css",
      "./js/*.js",
    ]
  });
});

gulp.task("jsmin",function (){
  gulp.src('src/js/*.js')
  .pipe(jsmin())
  .pipe(rename({suffix: '.min'}))
  .pipe(gulp.dest('dist'));
});

gulp.task('cssmin',function (){
  gulp.src('src/css/*.css')
  .pipe(cleanCSS({compatibility: 'ie8'}))
  .pipe(rename({suffix:'.min'}))
  .pipe(gulp.dest('dist'));
});

gulp.task('default',function (){
  gulp.start('jsmin');
  gulp.start('cssmin');
})

