'use strict';
    var gulp           = require('gulp'),
		gutil          = require('gulp-util' ),
	    preproc 		   = require('gulp-less'),
		browserSync    = require('browser-sync'),
		concat         = require('gulp-concat'),
		uglify         = require('gulp-uglify'),
		cleanCSS       = require('gulp-clean-css'),
		rename         = require('gulp-rename'),
        plumber        = require('gulp-plumber'),
		pug         = require('gulp-pug'),
		del            = require('del'),
		imagemin       = require('gulp-imagemin'),
		cache          = require('gulp-cache'),
		autoprefixer   = require('gulp-autoprefixer'),
		notify         = require("gulp-notify"),
		inject = require('gulp-inject'),
		path = require('path'),
		gcmq = require('gulp-group-css-media-queries');

const config = {
    src: './src',
    css: {
        watch: '/less/**/*.less',
        src: '/less/main.less',
        dest: '/css'
    },
    html: {
        src: '/index.html'
    }
};

/*_________     Pug Build Html Files (Jade)      ________*/

gulp.task('pug', function() {
        gulp.src('src/**/*.pug')
            .pipe(plumber()) 
            .pipe(pug({pretty: true}))
            .pipe(gulp.dest('src'));

});

gulp.task('imagemin', function() {
	return gulp.src('src/img/**/*')
	.pipe(cache(imagemin()))
	.pipe(gulp.dest('dist/img')); 
});

gulp.task('less', function () {
    gulp.src(config.src + config.css.src)
            .pipe(preproc())
            .pipe(gcmq())
            .pipe(autoprefixer({
                browsers: ['> 0.1%'],
                cascade: false
            }))
            .pipe(cleanCSS({
                level: 2
            }))
            .pipe(gulp.dest(config.src + config.css.dest))
            .pipe(browserSync.reload({
                stream: true
            }));
});
/*_________     Browser Sync      ________*/

gulp.task('browserSync', function () {
    browserSync.init({
        server: {
            baseDir: config.src
        }
    });
});

gulp.task('js', ['common-js'], function() {
	return gulp.src([
		'src/libs/jquery.js',
		'src/libs/slick.min.js',
		'src/libs/jquery.pixlayout.js',
		'src/js/common.js', // Всегда в конце
		])
	.pipe(concat('scripts.min.js'))
	// .pipe(uglify()) // Минимизировать весь js (на выбор)
	.pipe(gulp.dest('src/js'));
});

gulp.task('common-js', function() {
	return gulp.src([
		'src/js/common.js',
		])
	.pipe(concat('common.min.js'))
	.pipe(uglify())
	.pipe(gulp.dest('src/js'));
});

gulp.task('watch',['browserSync'], function () {
	gulp.watch('src/**/*.pug',['pug']);
	gulp.watch(['src/**/*.js', 'src/js/common.js'], ['js']);
    gulp.watch(config.src + config.css.watch, ['less'], browserSync.reload);
    gulp.watch(config.src + config.html.src, browserSync.reload);
});


gulp.task('removedist', function() { return del.sync('dist'); });

gulp.task('clearcache', function () { return cache.clearAll(); });

gulp.task('build', ['removedist', 'imagemin', 'less', 'js'], function() {

	var buildFiles = gulp.src([
		'src/*.html',
		'src/.htaccess',
		]).pipe(gulp.dest('dist'));

	var buildCss = gulp.src([
		'src/css/main.css',
		]).pipe(gulp.dest('dist/css'));

	var buildJs = gulp.src([
		'src/js/scripts.min.js',
		]).pipe(gulp.dest('dist/js'));

	var buildFonts = gulp.src([
		'src/fonts/**/*',
		]).pipe(gulp.dest('dist/fonts'));

});