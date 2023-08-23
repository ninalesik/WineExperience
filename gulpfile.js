const gulp        = require('gulp');
const browserSync = require('browser-sync');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify-es').default;
const sass = require('gulp-sass')(require('sass'));
const cleanCSS = require('gulp-clean-css');
const autoprefixer = require('gulp-autoprefixer');
const rename = require("gulp-rename");
const imagemin = require('gulp-imagemin');
const ttf2woff = require('gulp-ttf2woff');
const ttf2woff2 = require('gulp-ttf2woff2');
const webp = require('gulp-webp');
// const avif = require('gulp-avif');

const server = function() {
    browserSync({
        server: {
            baseDir: "dist"
        }
    });
    gulp.watch("src/*.html").on('change', browserSync.reload);
};

const styles = function() {
    return gulp.src("src/sass/**/*.+(scss|sass)")
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(rename({suffix: '.min', prefix: ''}))
        .pipe(autoprefixer())
        .pipe(cleanCSS())
        .pipe(gulp.dest("dist/css"))
        .pipe(browserSync.stream());
};

const html = function () {
    return gulp.src("src/*.html")
        .pipe(gulp.dest("dist/"));
};

const scripts = function () {
    return gulp.src([
        'node_modules/swiper/swiper-bundle.min.js',
        'src/js/**/*.js'
    ])
        .pipe(concat('main.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest("dist/js"))
        .pipe(browserSync.stream());
};

const fonts = function () {
    return gulp.src('src/fonts/*.ttf')
        .pipe(ttf2woff())
        .pipe(gulp.dest('dist/fonts'))
        .pipe(gulp.src('src/fonts/*.ttf'))
        .pipe(ttf2woff2())
        .pipe(gulp.dest('dist/fonts'));
};

const icons = function () {
    return gulp.src("src/icons/**/*")
        .pipe(gulp.dest("dist/icons"))
        .pipe(browserSync.stream());
};

const images = function () {
    return gulp.src("src/img/**/*")
        .pipe(imagemin())
        .pipe(gulp.dest("dist/img"))
        .pipe(browserSync.stream());
};

const webpImages = function() {
    return gulp.src("src/img/**/*.{png,jpg,jpeg}")
        .pipe(webp())
        .pipe(gulp.dest("dist/img"));
}; 


const watch = function() {
    gulp.watch("src/sass/**/*.+(scss|sass|css)", gulp.parallel(styles));
    gulp.watch("src/*.html").on('change', gulp.parallel(html));
    gulp.watch("src/js/**/*.js").on('change', gulp.parallel(scripts));
    gulp.watch("src/fonts/*").on('all', gulp.parallel(fonts));
    gulp.watch("src/icons/**/*").on('all', gulp.parallel(icons));
    gulp.watch("src/img/**/*").on('all', gulp.parallel(images));
    gulp.watch("src/img/**/*.{png,jpg,jpeg}", gulp.parallel(webpImages));
};

exports.server = server;
exports.styles = styles;
exports.html = html;
exports.scripts = scripts;
exports.fonts = fonts;
exports.icons = icons;
exports.images = images;
exports.webpImages = webpImages;
exports.watch = watch;

exports.default = gulp.parallel(watch, server, images, webpImages, styles, scripts, fonts, icons, html);

