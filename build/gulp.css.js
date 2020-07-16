
const gulp = require('gulp')
const { src, dest } = require('gulp')
const less = require('gulp-less')
const cssmin = require('gulp-cssmin')
const concat = require('gulp-concat')

const path = require('path')
const fs = require('fs')
// 读取theme-chalk文件里的所有less文件
const items = fs.readdirSync('./packages/theme-chalk')

const files = items.filter(item => !fs.statSync(path.resolve('./packages/theme-chalk', item)).isDirectory())
const entryHash = {}
if (files.length > 0) {
  files.forEach(ele => {
    if (ele !== 'index.less') {
      entryHash[ele] = `./packages/theme-chalk/${ele}`
    }
  })
}
function compileCss (cb) {
  for (const key in entryHash) {
    src(entryHash[key])
      .pipe(less())
      .pipe(cssmin())
      .pipe(dest('./lib/styles'))
  }
  cb()
}

function compileAll () {
  return src('./packages/theme-chalk/index.less')
    .pipe(less())
    .pipe(concat('xx-ui.css'))
    .pipe(cssmin())
    .pipe(dest('./lib/styles'))
}

gulp.task('css', compileCss)
gulp.task('all', compileAll)
