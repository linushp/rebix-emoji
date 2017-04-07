var gulp = require('gulp');
var rename = require('gulp-rename');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');

//压缩js
gulp.task('minifyNoDataSource', function () {

    var jsArray = [
        //'./src/js/emojiDataSource.js', //不压缩
        './src/js/emojiGroup.js',
        './src/js/emojiPosAndUCD.js',
        './src/js/emojiFunctions.js',
        './src/js/index.js'
    ];

    return gulp.src(jsArray).pipe(concat('noDataSource.js'))
        .pipe(gulp.dest('./dist/tmp'))
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(gulp.dest('./dist/tmp'));
});


gulp.task('concat', ["minifyNoDataSource"], function () {
    return gulp.src([
            './src/js/emojiDataSource.js', //不压缩
            './dist/tmp/noDataSource.js'
        ])
        .pipe(concat('rebix-emoji-group.js'))
        .pipe(gulp.dest('./dist'));
});

gulp.task('minify', ["minifyNoDataSource"], function () {

    return gulp.src([
            './src/js/emojiDataSource.js', //不压缩
            './dist/tmp/noDataSource.min.js'
        ])

        .pipe(concat('rebix-emoji-group.min.js'))
        .pipe(gulp.dest('./dist'));
});


gulp.task('default',['concat','minify']);