var gulp = require('gulp'),
	sass = require('gulp-sass'),
	browserSync = require('browser-sync'),
	autoprefixer = require('gulp-autoprefixer'),
	uglify = require('gulp-uglifyjs'),
	cssnano = require('gulp-cssnano'),
	concat = require('gulp-concat'),
	rename = require('gulp-rename'),
	imagemin = require('gulp-imagemin'),
	pngquant = require('imagemin-pngquant'),
	pug = require('gulp-pug'),
	cache = require('gulp-cache'),
	del = require('del');

gulp.task('sass', function () {
	return gulp.src('src/sass/**/*.scss')
		.pipe(sass())
		.pipe(autoprefixer(['last 15 version', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
		.pipe(gulp.dest('build/css'))
		.pipe(browserSync.reload({ stream: true }))
});

gulp.task('views', function buildHTML() {
	return gulp.src('src/pug/*.pug')
		.pipe(pug({
			pretty: true,
		})).pipe(gulp.dest('build'))
		.pipe(browserSync.reload({ stream: true }))
});

gulp.task('scripts', ['delJs'], function () {
	return gulp.src([
		'src/libs/jquery/dist/jquery.js',
		'src/libs/mask/mask.js',
		'src/libs/air-datepicker/dist/js/datepicker.js',
		'src/libs/scrollbar/jquery.mCustomScrollbar.js',
		// 'src/libs/scrolloverflow.js',
		// 'src/libs/fullpage/fullpage.js',
		// 'src/libs/slick/slick/slick.js',
		// 'src/libs/fancybox/dist/jquery.fancybox.js',
	])
		.pipe(concat('libs.min.js'))
		.pipe(uglify())
		.pipe(gulp.dest('build/js'))
});

gulp.task('css-libs', ['sass'], function () {
	return gulp.src('build/css/main.css')
		.pipe(cssnano())
		.pipe(rename({ suffix: '.min' }))
		.pipe(gulp.dest('build/css'))
});

gulp.task('browser-sync', function () {
	browserSync({
		server: {
			baseDir: 'build'
		},
		notify: false
	});
});

gulp.task('del', function () {
	return del.sync('src/js/main.js');
});
gulp.task('delJs', function () {
	return del.sync('build/js/libs.min.js');
});



gulp.task('cache', function () {
	return cache.clearAll();
});

gulp.task('img', function () {
	return gulp.src('src/images/**/*')
		.pipe(cache(imagemin({
			interlaced: true,
			progressive: true,
			svgoPlugins: [{ removeViewBox: false }],
			une: [pngquant()]
		})))
		.pipe(gulp.dest('build/images/'));
});

gulp.task('mainjs', function () {
	return gulp.src([
		'src/js/**/*'
	]).pipe(gulp.dest('build/js'));
});

gulp.task('font', function () {
	return gulp.src([
		'src/fonts/*.*'
	]).pipe(gulp.dest('build/fonts'));
});

gulp.task('delWatch', function () {
	return del.sync('build');
});

gulp.task('watch', ['delWatch', 'browser-sync', 'css-libs', 'img', 'views', 'mainjs', 'font'], function () {
	gulp.watch('src/sass/**/*.scss', ['sass']);
	gulp.watch('src/**/*.html', browserSync.reload);
	gulp.watch('src/pug/**/*.pug', ['views'], browserSync.reload);
	gulp.watch('src/js/**/*.js', ['mainjs'], browserSync.reload);
	gulp.watch('src/images/**/*', ['img'], browserSync.reload);
});
