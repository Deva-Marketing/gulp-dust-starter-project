/*jslint node:true */
'use strict';

module.exports = function (gulp) {
    var watch = require('gulp-watch');

    return function () {
        return watch('css/**/*.scss', function () {
            gulp.start('css');
        });
    };
};
