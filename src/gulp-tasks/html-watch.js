/*jslint node:true */
'use strict';

module.exports = function (gulp) {
    var watch = require('gulp-watch');

    return function () {
        return watch(['html/**/*.dust', 'html/**/*.json', 'html/**/*.js'], function () {
            gulp.start('html');
        });
    };
};
