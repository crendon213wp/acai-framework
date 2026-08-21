const { src, dest, series, watch }              = require('gulp');
const sass                                      = require('gulp-sass')(require('sass'));
const cleanCSS                                  = require('gulp-clean-css');
const terser                                    = require('gulp-terser');
const htmlmin                                   = require('gulp-htmlmin');
const browserSync                               = require('browser-sync').create();
const sourcemaps                                = require('gulp-sourcemaps');
const imageminModule                            = require('gulp-imagemin');
const imagemin                                  = imageminModule.default || imageminModule;
const { deleteAsync }                           = require('del');

// 👉 ADDED: gulp-file-include
const fileinclude                               = require('gulp-file-include');
const gulpSitemap                               = require('gulp-sitemap');
const site                                      = require('./site.config');

// ------------------------
// Paths
// ------------------------
const paths = {
    src: 'src',
    dist: 'dist'
};

// ------------------------
// Clean dist
// ------------------------
function clean() {
    return deleteAsync([`${paths.dist}/**`, `!${paths.dist}`]);
}

// ------------------------
// HTML
// ------------------------
function html() {
    return src([
        `${paths.src}/**/*.html`,
        `!${paths.src}/partials/**/*.html`
    ])
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(htmlmin({
            collapseWhitespace: true,
            removeComments: true
        }))
        .pipe(dest(paths.dist))
        .pipe(browserSync.stream());
}

// ------------------------
// Styles (SCSS → CSS)
// ------------------------
function styles() {
    return src(`${paths.src}/scss/**/*.scss`)
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(cleanCSS())
        .pipe(sourcemaps.write('.'))
        .pipe(dest(`${paths.dist}/css`))
        .pipe(browserSync.stream());
}

// ------------------------
// Scripts (your JS only)
// ------------------------
function scripts() {
    return src(`${paths.src}/js/**/*.js`)
        .pipe(sourcemaps.init())
        .pipe(terser())
        .pipe(sourcemaps.write('.'))
        .pipe(dest(`${paths.dist}/js`))
        .pipe(browserSync.stream());
}

// ------------------------
// Images
// ------------------------
function images() {
    return src(`${paths.src}/images/**/*`, {
        encoding: false
    })
        .pipe(imagemin())
        .pipe(dest(`${paths.dist}/images`))
        .pipe(browserSync.stream());
}

// ------------------------
// Robots.txt
// ------------------------
function robots() {
    return src(`${paths.src}/robots.txt`, {
        allowEmpty: true
    })
        .pipe(dest(paths.dist));
}

// ------------------------
// Sitemap
// ------------------------
function sitemap() {
    return src([
        `${paths.dist}/**/*.html`,
        `!${paths.dist}/404.html`,
        `!${paths.dist}/partials/**/*.html`
    ], { read: false })
        .pipe(gulpSitemap({
            siteUrl: site.site.url,
            changefreq: site.seo.changefreq,
            priority: site.seo.priority
        }))
        .pipe(dest(paths.dist));
}

// ------------------------
// BrowserSync
// ------------------------
function serve(cb) {
    browserSync.init({
        server: {
            baseDir: paths.dist
        },
        notify: false,
        open: true
    });
    cb();
}

// ------------------------
// Watch
// ------------------------
function watcher() {
    watch(`${paths.src}/**/*.html`, html);
    watch(`${paths.src}/scss/**/*.scss`, styles);
    watch(`${paths.src}/js/**/*.js`, scripts);
    watch(`${paths.src}/images/**/*`, images);
    watch(`${paths.src}/robots.txt`, robots);
}

// ------------------------
// Default
// ------------------------
exports.default = series(
    clean,
    html,
    styles,
    scripts,
    images,
    robots,
    sitemap,
    serve,
    watcher
);