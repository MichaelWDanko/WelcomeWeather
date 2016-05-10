var gulp = require('gulp');
var sass = require('gulp-sass');
var browserify = require('gulp-browserify');

gulp.task('default', ['html', 'js', 'css', 'imgs']);

gulp.task('html', function () {
    gulp.src('./templates/*.html')
        .pipe(gulp.dest('./public/templates/'));
    return gulp.src('./*.html')
        .pipe(gulp.dest('./public'));
});


gulp.task('css', function () {
    return gulp.src('./scss/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('./public/css'));
});

gulp.task('js', function () {
    return gulp.src('./js/app.js')
        .pipe(browserify())
        .pipe(gulp.dest('./public/js'));
});

gulp.task('imgs', function () {
    return gulp.src('./images/*')
        .pipe(gulp.dest('./public/images'));
});

gulp.task('watch', function () {
    gulp.watch('./*.html', ['html']);
    gulp.watch('./templates/*.html', ['html']);
    gulp.watch('./scss/*.scss', ['css']);
    gulp.watch('./js/*.js', ['js']);
});