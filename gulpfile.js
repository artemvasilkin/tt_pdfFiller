const { src, dest, watch, series } = require("gulp");

const browserSync = require("browser-sync").create();
const pug = require("gulp-pug");
const bem = require("pug-bem");
const svgSprite = require("gulp-svg-sprite");
const svgmin = require("gulp-svgmin");
const replace = require("gulp-replace");
const sass = require("gulp-sass");
const uglifycss = require('gulp-uglifycss');
const uglify = require('gulp-uglify');

function markup() {
  return src("app/pages/*.pug")
    .pipe(pug({ plugins: [bem] }))
    .pipe(dest("dist/"))
    .pipe(browserSync.stream());
}

function sprite() {
  return src("app/icons/*.svg")
    .pipe(
      svgmin({
        js2svg: {
          pretty: true
        }
      })
    )
    .pipe(replace("&gt;", ">"))
    .pipe(
      svgSprite({
        mode: {
          stack: {
            sprite: "../sprite.svg"
          }
        }
      })
    )
    .pipe(dest("dist/icons"));
}

function styles() {
  return src("app/styles/*.scss")
    .pipe(sass())
    .pipe(uglifycss())
    .pipe(dest("dist/"))
    .pipe(browserSync.stream());
}

function scripts() {
  return src("app/scripts/*.js")
    .pipe(uglify())
    .pipe(dest("dist/scripts"))
    .pipe(browserSync.stream());
}

function fonts() {
  return src("app/fonts/*").pipe(dest("dist/fonts"))
}

function start() {
  series(markup, sprite, styles, scripts, fonts)();

  browserSync.init({
    server: {
      baseDir: "./dist",
      index: "/index.html"
    }
  });

  watch(["app/pages/*.pug", "app/templates/**/*.pug", "app/components/**/*.pug"], markup);
  watch("app/icons/*.svg", sprite);
  watch(["app/styles/*.scss", "app/templates/**/*.scss", "app/components/**/*.scss"], styles);
  watch("app/scripts/*.js", scripts);
  watch("app/fonts/*", fonts);
}

exports.markup = markup;
exports.sprite = sprite;
exports.styles = styles;
exports.scripts = scripts;
exports.fonts = fonts;
exports.start = start;
exports.default = start;
