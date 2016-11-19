/*jslint node:true */
'use strict';

module.exports = function (error) {
    console.error(error.toString());
    this.emit('end');
};
