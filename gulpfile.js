const {gulp, series, parallel, src, dest} = require('gulp');
const del = require('del');
const rename = require('gulp-rename');
const gulpCssPreprocessor = require('gulp-css-preprocessor');
const gulpConcat = require('gulp-concat');
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const htmlreplace = require('gulp-html-replace');

function clean() {
    return del('prod')
}

function copyFiles() {
    return src('src/img/**/*')
        .pipe(dest('prod/img'))
}
function htmlImportsReplace() {
    return src('src/index.html')
        .pipe(htmlreplace({
            'css': 'css/main.min.css',
            'js': 'js/main.min.js'
        }))
        .pipe(dest('prod'))
}

function cssCompile() {
    return src(['src/css/global.less', 'src/bem/**/*.less', 'src/bem/**/*.sass'])
        .pipe(gulpCssPreprocessor())
        .pipe(gulpConcat('main.css'))
        .pipe(dest('src/css'));
}
function cssNormalize() {
    return src(['node_modules/normalize.css/normalize.css','src/css/main.css'])
        .pipe(gulpConcat('main.css'))
        .pipe(dest('src/css'));
}
function cssMinify() {
    return src('/home/user/IdeaProjects/frontend_2_envion/src/css/main.css')
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(rename({ extname: '.min.css' }))
        .pipe(dest('prod/css'))
}

function jsConcat() {
    return src(['src/js/**/*.js', '!src/js/main.js'])
        .pipe(gulpConcat('main.js'))
        .pipe(dest('src/js'));
}
function jsUglify() {
    return src('src/js/main.js')
        .pipe(uglify())
        .pipe(rename({ extname: '.min.js' }))
        .pipe(dest('prod/js'))
}

exports.clean = clean;
exports.dev = parallel(
    series(cssCompile, cssNormalize),
    jsConcat
);
exports.prod = series(
    clean,
    parallel(
        series(cssCompile, cssNormalize, cssMinify),
        series(jsConcat, jsUglify),
        htmlImportsReplace,
        copyFiles
    )
);
