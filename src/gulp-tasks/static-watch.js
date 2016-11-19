/*jslint node:true */
'use strict';

module.exports = function (gulp) {
    var watch = require('gulp-watch');

    return function () {
        return watch(['images/**/*', 'assets/**/*', 'js/lib/**/*'], function () {
            gulp.start('static');
            gulp.del(['build'], cb);
        });
    };
};
