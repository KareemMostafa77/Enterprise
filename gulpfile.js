const gulp = require("gulp");
const sass = require('gulp-sass')(require('sass'));
const babel = require("gulp-babel");
const uglify = require("gulp-uglify");
const imagemin = require("gulp-imagemin");
const pug = require("gulp-pug");
const rename = require('gulp-rename');

// Compile Pug to HTML
function compilePug() {
  return gulp.src("src/pug/pages/*.pug")
    .pipe(pug())
    .pipe(gulp.dest("dist"));
}

// Compile SCSS to CSS
function compileSass() {
  return gulp.src("src/assets/scss/**/*.scss")
    .pipe(sass().on('error', sass.logError)) // Handle errors
    .pipe(gulp.dest("dist/assets/styles"));
}

// Transpile ES6 to ES5
function transpileES6() {
  return gulp.src("src/assets/js/**/*.mjs")
    .pipe(babel({
      presets: ["@babel/env"]
    }))
    .pipe(uglify())
    .pipe(gulp.dest("dist/assets/scripts"));
}

// Compress Images
function compressImages() {
  return gulp.src(["src/assets/images/general/*", "src/assets/images/carousel/*"], { base: "src/assets/images" })
    .pipe(imagemin())
    .pipe(rename(function (path) {
      path.dirname = path.dirname.replace('src/assets', 'dist/assets');
    }))
    .pipe(gulp.dest("./dist/assets/images"));
}

// Task for building without watching
const build = gulp.series(compileSass, transpileES6, compilePug, compressImages);

// Watch Files for Changes
function watchFiles() {
  gulp.watch("src/pug/**/*.pug", compilePug);
  gulp.watch("src/assets/scss/**/*.scss", compileSass);
  gulp.watch("src/assets/js/**/*.mjs", transpileES6);
  gulp.watch("src/assets/images/*", compressImages);
}

// Default task with watching
exports.default = gulp.series(build, watchFiles);

// Task for running build without watching
exports.build = build;
