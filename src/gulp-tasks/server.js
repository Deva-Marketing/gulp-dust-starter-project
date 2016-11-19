/*jslint node:true */
'use strict';

module.exports = function (gulp) {
    var server = require('gulp-server-livereload');

    return function () {
        return gulp.src('./../htdocs/landing/').pipe(server({
            livereload: true,
            directoryListing: {
                enable: true,
                path: './../htdocs/landing/'
            },
            open: true
        }));
    };
};
