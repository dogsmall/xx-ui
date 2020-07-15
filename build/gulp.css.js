
const gulp = require('gulp')
const { src, dest } = require('gulp')
const less = require('gulp-less')
const cssmin = require('gulp-cssmin')
// const rename = require('gulp-rename');
const concat = require('gulp-concat')

function compileCss () {
  return src('./packages/theme-chalk/*.less')
    .pipe(less())
    .pipe(cssmin())
    .pipe(dest('./lib/theme-chalk'))
}

function compileAll () {
  return src('./packages/theme-chalk/*.less')
    .pipe(less())
    .pipe(concat('index.css'))
    .pipe(cssmin())
  // .pipe(rename({
  //     suffix: '.min'
  // }))
    .pipe(dest('./lib/theme-chalk'))
}

gulp.task('css', compileCss)
gulp.task('all', compileAll)

// function copyfont() {
//   return src('./src/fonts/**')
//     .pipe(cssmin())
//     .pipe(dest('./lib/fonts'));
// }
