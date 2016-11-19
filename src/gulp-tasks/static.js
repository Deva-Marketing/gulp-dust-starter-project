/*jslint node:true */
'use strict';

module.exports = function (gulp) {
    var merge = require('merge-stream');

    return function () {
        return merge(
            gulp.src('images/**/*').pipe(gulp.dest('../htdocs/landing/images/')),
            gulp.src('assets/**/*').pipe(gulp.dest('../htdocs/landing/assets/')),
            gulp.src('js/lib/**/*').pipe(gulp.dest('../htdocs/landing/js/lib/'))
        );
    };
};
