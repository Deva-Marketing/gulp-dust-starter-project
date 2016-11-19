/*jslint node:true */
'use strict';

module.exports = function (gulp) {
    var plumber = require('gulp-plumber');
    var errorHandler = require('../gulp-error-handler');
    var sass = require('gulp-sass');
    var postcss = require('gulp-postcss');
    var autoprefixer = require('autoprefixer');
    var nano = require('gulp-cssnano');
    var sourcemaps = require('gulp-sourcemaps');

    return function () {
        return gulp.src('css/*.scss')
            .pipe(plumber({ errorHandler: errorHandler }))
            .pipe(sourcemaps.init())
            .pipe(sass())
            .pipe(postcss(
                [
                    autoprefixer({ browsers: ['last 2 versions', 'ie 9'] })
                ]
            ))
            .pipe(nano())
            .pipe(sourcemaps.write('./'))
            .pipe(plumber.stop())
            .pipe(gulp.dest('../htdocs/landing/css'));
    };
};
