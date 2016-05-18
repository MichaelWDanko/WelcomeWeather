var gulp = require('gulp');
var sass = require('gulp-sass');
var browserify = require('gulp-browserify');
var deploy = require('gulp-gh-pages');

gulp.task('default', ['html', 'js', 'css', 'cname']);

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
    return gulp.src('./js/*.js')
        .pipe(browserify())
        .pipe(gulp.dest('./public/js'));
});

gulp.task('images', function () {
    gulp.src('./images/bg/*')
        .pipe(gulp.dest('./public/images/bg/'))
    return gulp.src('./images/*')
        .pipe(gulp.dest('./public/images'));
});

gulp.task('watch', function () {
    gulp.watch('./*.html', ['html']);
    gulp.watch('./templates/*.html', ['html']);
    gulp.watch('./scss/*.scss', ['css']);
    gulp.watch('./js/*.js', ['js']);
});

gulp.task('cname', function () {
   return gulp.src('./CNAME')
        .pipe(gulp.dest('./public/'));
});

gulp.task('deploy', function() {
   gulp.src('./public/**/*')
   .pipe(deploy());
});
