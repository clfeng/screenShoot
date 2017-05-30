var gulp = require('gulp');
var jsmin = require('gulp-jsmin');
var rename = require('gulp-rename');
var cleanCSS = require('gulp-clean-css');
var browserSync = require('browser-sync');
var sass = require('gulp-sass');
var sassGlob = require('gulp-sass-glob');

gulp.task('server',function (){
  browserSync.init({
    "server":"./src/",
    "port":"3500",
    "files":[
    "./src/*.html",
    "./src/css/*.css",
    "./src/js/*.js",
    ]
  });
});
gulp.task('styles', function () {
  gulp.watch('./main.scss',function (event){
    gulp
    .src('./main.scss')
    .pipe(sassGlob())
    .pipe(sass())
    .pipe(gulp.dest('./styles'));
  })
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
  gulp.start('styles');
  // gulp.start('jsmin');
  // gulp.start('cssmin');
  // gulp.start('server');
});

/*
gulp.task('styles', function () {
    gulp.watch('./main.scss',function (event){
        gulp
        .src('./main.scss')
        .pipe(sassGlob())
        .pipe(sass())
        .pipe(gulp.dest('dist/styles'));
    })
});
*/