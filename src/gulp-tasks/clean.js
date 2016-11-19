/*jslint node:true */
'use strict';

module.exports = function () {
    var del = require('del');

    return function () {
        return del(['./../htdocs/landing/**/*'], { force: true });
    };
};
