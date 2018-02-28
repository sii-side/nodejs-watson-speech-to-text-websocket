const settings = {
  dir: {
    dist: 'docs/',
    dist_css: 'docs/common/css/',
    dist_js: 'docs/common/js/',
    dist_ejs: 'docs/',
    dist_img: 'docs/common/img/',
    src: 'src/',
    src_css: 'src/common/css/',
    src_js: 'src/common/js/',
    src_ejs: 'src/',
    src_img: 'src/common/img/'
  },
  file: {
    css: 'bundle.css',
    js: 'bundle.js'
  }
}

// ----------------------------------------------

const fs = require('fs')
const sync = require('browser-sync').create()

// gulp main
const gulp = require('gulp')

// general
const plumber = require('gulp-plumber')
const sourcemaps = require('gulp-sourcemaps')
const data = require('gulp-data')

// file
const filter = require('gulp-filter')
const rename = require('gulp-rename')
const concat = require('gulp-concat')

// html
const ejs = require('gulp-ejs')
const prettify = require('gulp-html-prettify')

// image
const imagemin = require('gulp-imagemin')
const cache = require('gulp-cache')
const pngquant = require('imagemin-pngquant')
const mozjpeg = require('imagemin-mozjpeg')

// css
const sass = require('gulp-sass')
const csslint = require('gulp-csslint')
const prefixer = require('gulp-autoprefixer')
const csscomb = require('gulp-csscomb')
const cmq = require('gulp-merge-media-queries')
const cleancss = require('gulp-clean-css')

// js
const webpack = require('webpack')
const webpackConfig = require('./webpack.config')
const webpackStream = require('webpack-stream')

// ----------------------------------------------

gulp.task('sass', function (callback) {
  gulp.src([
    settings.dir.src_css + '**/*.scss',
    '!' + settings.dir.src_css + '**/bootstrap.scss',
    '!' + settings.dir.src_css + '**/fontawesome.scss',
    '!' + settings.dir.src_css + '**/slick.scss'
  ]).pipe(plumber({
    handleError: function (err) {
      console.log(err)
      this.emit('end')
    }
  }))
  .pipe(sass())
  .pipe(csslint({
    'box-model': false,
    'order-alphabetical': false
  }))
  .pipe(csslint.formatter())

  gulp.src([settings.dir.src_css + '**/*.scss'])
    .pipe(plumber({
      handleError: function (err) {
        console.log(err)
        this.emit('end')
      }
    }))
    .pipe(sourcemaps.init())
    .pipe(sass({
      sourcemap: true
    }))
    .pipe(prefixer())
    .pipe(csscomb())
    .pipe(cmq({
      log: true
    }))
    .pipe(concat(settings.file.css))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(settings.dir.dist_css))
    .pipe(filter('**/*.css'))
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(cleancss())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(settings.dir.dist_css))
    .pipe(sync.stream())

  callback()
})

gulp.task('js', function (callback) {
  webpackStream(webpackConfig, webpack)
    .pipe(gulp.dest(settings.dir.dist_js))

  callback()
})

gulp.task('html', function (callback) {
  const json = JSON.parse(fs.readFileSync('./src/_ejs/_data.json'))

  gulp.src([settings.dir.src_ejs + '**/*.ejs', '!' + settings.dir.src_ejs + '**/_*.ejs'])
    .pipe(plumber({
      handleError: function (err) {
        console.log(err)
        this.emit('end')
      }
    }))
    .pipe(data(file => {
      const fPath = file.path.replace(/\\/g, '/').replace('.ejs', '.html')
      const aPath = fPath.substring(fPath.indexOf(settings.dir.src) + settings.dir.src.length - 1)

      return {
        data: json,
        path: {
          full: fPath,
          abs: aPath,
          abs2: aPath.replace('/index.html', '/'),
          base: aPath.substring(aPath.lastIndexOf('/') + 1),
          dir: aPath.split('/').length === 2 ? '/' : aPath.substring(0, aPath.lastIndexOf('/')),
          root: aPath.split('/').length === 2 ? './' : '../'.repeat(aPath.split('/').length - 2),
          ejs: '../'.repeat(aPath.split('/').length - 2) + '_ejs/'
        }
      }
    }))
    .pipe(ejs())
    .pipe(prettify({
      indent_char: ' ',
      indent_size: 2
    }))
    .pipe(rename({
      extname: '.html'
    }))
    .pipe(gulp.dest(settings.dir.dist_ejs))

  callback()
})

gulp.task('image', function (callback) {
  gulp.src([settings.dir.src_img + '**/*'])
    .pipe(plumber({
      handleError: function (err) {
        console.log(err)
        this.emit('end')
      }
    }))
    .pipe(cache(imagemin([
      pngquant({
        quality: '65-80',
        speed: 1
      }),
      mozjpeg({
        quality: 80
      }),
      imagemin.svgo(),
      imagemin.gifsicle()
    ])))
    .pipe(gulp.dest(settings.dir.dist_img))

  callback()
})

gulp.task('sync-reload', function (callback) {
  sync.reload()
  callback()
})

gulp.task('default', gulp.series('js', 'sass', 'html', 'image', function (callback) {
  sync.init({
    reloadDelay: 2000,
    host: '192.168.10.101',
    server: {
      baseDir: settings.dir.dist
    }
  })
  gulp.watch(settings.dir.src_js + '**/*.js', gulp.series('js', 'sync-reload'))
  gulp.watch(settings.dir.src_css + '**/*.scss', gulp.series('sass', 'sync-reload'))
  gulp.watch(settings.dir.src_ejs + '**/*.ejs', gulp.series('html', 'sync-reload'))
  gulp.watch(settings.dir.src_ejs + '**/*.json', gulp.series('html', 'sync-reload'))
  gulp.watch(settings.dir.src_img + '**/*', gulp.series('image'))

  callback()
}))
