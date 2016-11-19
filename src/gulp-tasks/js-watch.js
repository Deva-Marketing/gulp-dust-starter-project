/*jslint node:true */
'use strict';

module.exports = function (gulp) {
    var watch = require('gulp-watch');

    return function () {
        return watch(['js/**/*.js', '!js/lib/**'], function () {
            gulp.start('js');
        });
    };
};
