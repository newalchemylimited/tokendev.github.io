var gulp = require('gulp');
var connect = require('gulp-connect');
var browserSync = require('browser-sync').create();
var sass = require('gulp-sass');
var concatCss = require('gulp-concat-css');
 
// gulp.task('fontcss', function () {
//   return gulp.src('./fonts/**/*.css')
//     .pipe(concatCss('fonts.css'))
//     .pipe(gulp.dest('./css'));
// });

gulp.task('serve', function() {

    browserSync.init({
        server: __dirname,
        serveStaticOptions: {
          extensions: ["html", "js", "css", "png", ".pdf"]
        }
    });

    gulp.watch("./css/*.css").on('change', browserSync.reload);
    gulp.watch("./*.html").on('change', browserSync.reload);
    gulp.watch("./js/**/*.js").on('change', browserSync.reload);
});

gulp.task('connect', function() {
  connect.server({
    livereload: true
  });
});

// gulp.task('watch', function() {
//   connect.server({
//     livereload: true
//   });
// });

gulp.task('html', function () {
  gulp.src(__dirname+'/*.html')
    .pipe(connect.reload());
});

gulp.task('js', function () {
  gulp.src('./js/**/*.js')
    .pipe(connect.reload());
});

gulp.task('sass', function () {
  return gulp.src('./sass/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./css'))
    .pipe(connect.reload());
});

gulp.task('sass2', function () {
  return gulp.src('./sass/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./css'))
    .pipe(browserSync.stream());
});

gulp.task('watch', function () {
  gulp.watch([__dirname+'/*.html'], ['html']);
  gulp.watch(['./js/**/*.js'], ['js']);
  gulp.watch(['./sass/*.scss'], ['sass']);
});


gulp.task('justserve', function() {
  connect.server({
    livereload: false
  });
});

gulp.task('connecter', ['connect', 'watch']);

gulp.task('default', ['serve']);