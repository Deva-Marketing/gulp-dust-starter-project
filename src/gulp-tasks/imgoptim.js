/*jslint node:true */
'use strict';

module.exports = function (gulp) {
    var merge = require('merge-stream');
   	var imageOptim = require('gulp-imageoptim');

    return function () {
        return merge(
            gulp.src('images/**/*')
            .pipe(imageOptim.optimize())
            .pipe(gulp.dest('../htdocs/landing/images/'))
        );
    };
};
