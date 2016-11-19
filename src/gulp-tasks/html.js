/*jslint node:true */
'use strict';

module.exports = function (gulp) {
    var plumber = require('gulp-plumber');
    var errorHandler = require('../gulp-error-handler');
    var dust = require('dustjs-linkedin');
    dust.helpers = require('dustjs-helpers').helpers;
    dust.config.cache = false;
    var dustHtml = require('gulp-dust-html');

    return function () {
        return gulp.src(['html/**/*.dust', '!html/**/partials/**'])
            .pipe(plumber({ errorHandler: errorHandler }))
            .pipe(dustHtml({
                basePath: 'html/partials',
                whitespace: true,
                data: function (file) {
                    try {
                        var path = file.path.slice(0, -5),
                            data;

                        if (require.cache[require.resolve(path)]) {
                            delete require.cache[require.resolve(path)];
                        }

                        data = require(path);

                        return data;
                    } catch (ex) {
                        return { };
                    }
                }
            }))
            .pipe(plumber.stop())
            .pipe(gulp.dest('../htdocs/landing/'));
    };
};
