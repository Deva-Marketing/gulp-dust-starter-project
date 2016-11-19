/*jslint node:true, browser:true */
/*global $*/
'use strict';

var obj = {};

obj.validate_required = function (input) {
    // Retrieve row class
    var row = input.parents('.input_row');

    if (!input.is(':visible')) {
        return true;
    }

    // Check for blank value
    if (input.val() === '') {
        // Highlight field
        if (input.prop("tagName") === 'SELECT') {
            row.find('.select_wrapper').addClass('error');
        } else {
            input.addClass('error');
        }

        // Show error message
        row.find('span.error').show();
        row.find('span.error').removeClass('hidden');

        return false;
    }

    if (input.val() !== '') {
        // Remove highlight
        if (input.prop("tagName") === 'SELECT') {
            row.find('.select_wrapper').removeClass('error');
        } else {
            input.removeClass('error');
        }

        // Hide error message
        row.find('span.error').hide();
        row.find('span.error').removeClass('hidden');

        return true;
    }
};

/**
 * Function to validate a jQuery form field object reference against an email regex script.
 *
 * @param object input A jQuery form field object
 * @return boolean Result of validation check
 */
obj.validate_email = function (input) {
    // Retrieve row class
    var row = input.parents('.input_row');

    // Check for valid email
    if (!(/^[a-zA-Z][\w\.\-]*[a-zA-Z0-9]@[a-zA-Z0-9][\w\.\-]*[a-zA-Z0-9]\.[a-zA-Z][a-zA-Z\.]*[a-zA-Z]$/.test(input.val().trim()))) {
        // Highlight field
        input.addClass('error');

        // Show error message
        row.find('span.error').show();
        row.find('span.error').removeClass('hidden');

        return false;
    }

    if ((/^[a-zA-Z][\w\.\-]*[a-zA-Z0-9]@[a-zA-Z0-9][\w\.\-]*[a-zA-Z0-9]\.[a-zA-Z][a-zA-Z\.]*[a-zA-Z]$/.test(input.val().trim()))) {
        // Remove highlight
        input.removeClass('error');

        // Hide error message
        row.find('span.error').hide();

        return true;
    }
};

obj.validate_checkbox = function (input) {
    // Retrieve row class
    var row = input.parents('.input_row');

    // Check for valid email
    if (!input.prop('checked')) {
         // Highlight field
        input.addClass('error');

        // Show error message
        row.find('span.error').show();
        row.find('span.error').removeClass('hidden');

        return false;
    }

    row.find('span.error').hide();

    return true;
};

obj.validate_matching = function (input, match) {
    // Retrieve row class
    var row = input.parents('.input_row');

    // Check for valid email
    if (input.val() !== $('input[name=' + match + ']').val()) {
         // Highlight field
        input.addClass('error');

        // Show error message
        row.find('span.error').show();
        row.find('span.error').removeClass('hidden');

        return false;
    }
    input.removeClass('error');
    row.find('span.error').hide();

    return true;
};

obj.validate_multi_select = function (input, select) {

    var row = select.parents('.input_row');

    if (input.length > 0) {
        console.log('exists');
        row.find('.select_wrapper').removeClass('error');
        row.find('span.error').hide();
        row.find('span.error').removeClass('hidden');
    } else {
        row.find('.select_wrapper').addClass('error');
        row.find('span.error').show();
        row.find('span.error').removeClass('hidden');
        return false;
    }

    return true;
};

module.exports = obj;