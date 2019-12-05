const gulp = require("gulp");
const sass = require("gulp-sass");
const browserSync = require("browser-sync");
const imageMin = require("gulp-imagemin");
const concat = require("gulp-concat");
const babel = require("gulp-babel");
const cleanCSS = require("gulp-clean-css");
const rename = require("gulp-rename");
const uglify = require("gulp-uglify");
const autoprefixer = require("gulp-autoprefixer");

const paths = {
  styles: {
    src: "src/sass/style.scss",
    dest: "dist"
  },
  scripts: {
    src: "src/js/**/*.js",
    dest: "dist"
  },
  images: {
    src: "src/images/*",
    dest: "dist/images"
  },
  layout: {
    src: "src/**/*.html",
    dest: "dist"
  }
};

function styles() {
  return gulp
    .src(paths.styles.src)
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(cleanCSS())
    .pipe(
      rename({
        basename: "style",
        suffix: ".min"
      })
    )
    .pipe(gulp.dest(paths.styles.dest))
    .pipe(browserSync.stream());
}

function scripts() {
  return gulp
    .src(paths.scripts.src, { sourcemaps: true })
    .pipe(
      babel({
        presets: ["@babel/env"]
      })
    )
    .pipe(uglify())
    .pipe(concat("app.min.js"))
    .pipe(gulp.dest(paths.scripts.dest))
    .pipe(browserSync.stream());
}

function images() {
  return gulp
    .src(paths.images.src)
    .pipe(imageMin())
    .pipe(gulp.dest(paths.images.dest))
    .pipe(browserSync.stream());
}

function server() {
  browserSync.init({
    server: "dist",
    index: "index.html"
  });
}

function copyHtml() {
  return gulp
    .src(paths.layout.src)
    .pipe(gulp.dest(paths.layout.dest))
    .pipe(browserSync.stream());
}

function watch() {
  gulp.watch(paths.layout.src, copyHtml);
  gulp.watch(paths.styles.src, styles);
  gulp.watch(paths.scripts.src, scripts);
  gulp.watch(paths.images.src, images);
}

const run = gulp.parallel(server, styles, scripts, images, watch, copyHtml);

exports.run = run;
exports.default = run;
