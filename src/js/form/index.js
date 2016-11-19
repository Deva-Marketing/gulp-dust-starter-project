/*jslint node:true, browser:true */
/*global $*/
'use strict';

var obj = {},
    validators = require('../validators'),
    form = require('../form-sizer'),
    form_invalid = null;

// default obj variables - editable in main js (formSizer for if set_box_sizes should run)(progressContainer incase className changes)(ajax for how the form submits)
obj.formSizer = false;
obj.progressContainer = 'form-progress';
obj.formSizerConfig = { 'container': '.forms-container', 'pages': ['.form1', '.form2', '.form3'] };

// validates an array of field objects
function validate(fields) {
    var valid = true;

    fields.forEach(function (field) {
        // defaults
        var validator = 'validate_required',
            input = field.type + '[name="' + field.name + '"]',
            opt = '',
            select = false;

        if (field.type === 'select') { select = true; }
        // check if options are supplied
        if (field.options) {
            // if 'email'/'checkbox' is supplied, change validator to email/checkbox
            if (field.options.indexOf('email') > -1) {
                validator = 'validate_email';
            } else if (field.options.indexOf('checkbox') > -1) {
                validator = 'validate_checkbox';
            } else if (field.options.indexOf('subSelect') > -1) {
                input = field.opt + ' > ' + input;
            } else if (field.options.indexOf('match') > -1) {
                validator = 'validate_matching';
                opt = field.opt;
            } else if (field.options.indexOf('multiSelect') > -1) {
                validator = 'validate_multi_select';
                input = field.type + '[name="' + field.name + '[]"]';
                select = true;
                opt = $('select[name="' + field.opt + '"]');
            }
        }
        if (!validators[validator]($(input), opt)) {
            // Check is first
            if (form_invalid === null) {
                form_invalid = $(input);
                if (select) { form_invalid = $(input).parent(); }
            }
            valid = false;
        }
    });
    return valid;
}

// resize boxes if formSizer is true
function boxSize() {
    if (obj.formSizer) {
        form.set_box_sizes(obj.formSizerConfig);
    }
}

// initializes keyUp listeners for fields that require validation
function listeners() {
    Object.keys(validators).forEach(function (validator) {
        $('.' + validator).bind("change keyup blur", function () {
            // Validate required input
            validators[validator]($(this));
            boxSize();
        });
    });
}

// switches form, taking class names for 'current' and 'next' as strings
function switchForm(current, next) {
    $('.' + current).fadeOut(250, function () {
        $('.' + next).fadeIn(250);
        $('.' + next).removeClass('hidden');

        // Scroll to top of form
        $('html, body').animate({
            scrollTop: $('#form').offset().top
        }, 750);
    });
}

// scrolls to the top invalid field
function invalidScroll() {
    $('html, body').animate({
        scrollTop: form_invalid.prev('label').offset().top
    }, 750);
}

obj.init = function (config) {
    if (config) {
        Object.getOwnPropertyNames(config).forEach(function (setting) {
            obj[setting] = Object.getOwnPropertyDescriptor(config, setting).value;
        });
    }
    listeners();
    boxSize();

    $('body').on('click', 'button.multiSelect', function () {
        var selectName = $(this).attr('id'),
            value = $(this).parent('div.multiSelect').children('span').html();
        $('select[name="' + selectName + '"] option[value*="' + value + '"]').prop('disabled', false);
        $(this).parent('div.multiSelect').remove();
    });
};

// init a next button, params: (string)btnName, (array of objects)fields, (object)current, (object)next
// each field expects: 'type' and 'name'. 'options' is optional and expects an array.
// current and next expects: 'form' and 'progress' (these are class names of the current/next form/progress level)
obj.initNext = function (btnName, fields, current, next) {
    $('input[name="' + btnName + '"]').click(function (event) {
        // Prevent default action
        event.preventDefault();

        // Reset first invalid element
        form_invalid = null;

        // Validate form
        var valid = validate(fields);

        if (valid) {
            if (current && next) {
                // Update progress
                $('.' + obj.progressContainer + ' .' + current.progress).addClass('complete');
                $('.' + obj.progressContainer + ' .' + next.progress).removeClass('complete');
                $('.' + obj.progressContainer + ' .' + next.progress).addClass('during');
            }
            // Show next form
            switchForm(current.form, next.form);
        } else if (form_invalid !== null) {
            invalidScroll();
        }
    });
};

// init a back button, params: (string)btnName, (object)current, (object)previous
// current and previous expects: 'form' and 'progress' (these are class names of the current/previous form/progress level)
obj.initBack = function (btnName, current, previous) {
    $('input[name="' + btnName + '"]').click(function (event) {
        // Prevent default action
        event.preventDefault();

        if (current && previous) {
            // Update progress
            $('.' + obj.progressContainer + ' .' + current.progress).removeClass('during');
            $('.' + obj.progressContainer + ' .' + previous.progress).removeClass('complete');
            $('.' + obj.progressContainer + ' .' + previous.progress).addClass('during');
        }

        // Show prev form
        switchForm(current.form, previous.form);
    });
};

// init a submit button, params: (string)btnName, (array of objects)fields, Optional:: (object)ajax
// each field expects: 'type' and 'name'. 'options' is optional and expects an array.
// ajax is optional, for ajax submition, expects object containing currentForm, thanksForm, waitTxt and progress.
obj.initSubmit = function (btnName, fields, ajax) {
    $('input[name="' + btnName + '"]').click(function (event) {
        // Prevent default action
        event.preventDefault();

        // Reset first invalid element
        form_invalid = null;

        // validate form
        var valid = validate(fields);

        if (valid) {
            $('input[name="' + btnName + '"]').prop('disabled', true);
            if (!ajax) {
                // normal submit
                $('form').submit();
            } else {
                // ajax submit
                $('input[name="' + btnName + '"]').val(ajax.waitTxt);
                $.post($('form').attr('action'), $('form').serialize(),
                    function (data) {
                        if (ajax.complete) {
                            ajax.complete(data);
                        }
                    }, "json");
                // Update progress
                if (ajax.progress) {
                    $('.' + obj.progressContainer + '.' + ajax.progress).addClass('complete');
                }
            }
        } else if (form_invalid !== null) {
            invalidScroll();
        }
    });
};

// init a sub select, params (string)parentSelectName, (string)subSelect Wrapper, (array of object)SubMenus, containing 'wrapper' & 'value'
obj.addSubSelect = function (name, subWrapper, cases) {
    $('select[name="' + name + '"]').change(function () {
        var found = false,
            value = $(this).val();

        cases.forEach(function (cas) {
            $(cas.wrapper).hide();
            $(cas.wrapper + " > select").prop('disabled', true);
            if (value === cas.value) {
                found = true;
                $(cas.wrapper + " > select").prop('disabled', false);
                $(cas.wrapper).show();
                $(subWrapper).slideDown('fast', function () {
                    boxSize();
                });
            }
        });
        if (!found) {
            $(subWrapper).slideUp('fast', function () {
                boxSize();
            });
        }
    });
};

obj.addMultiSelect = function (name, multiWrapper, multiName) {
    $('select[name="' + name + '"]').change(function () {
        var value = $(this).val(),
            html = '<div class="multiSelect"><span>' + value + '</span> <button type="button" id="' + name + '" class="multiSelect">-</button><input type="hidden" name="' + multiName + '[]" value="' + value + '"></div>';
        $(multiWrapper).append(html);
        $(this).val('');
        $('select[name="' + name + '"] option[value*="' + value + '"]').prop('disabled', true);
    });
};

(function () {
    var i;
    if (typeof Array.prototype.forEach !== 'function') {
        Array.prototype.forEach = function (callback) {
            for (i = 0; i < this.length; i += 1) {
                callback.apply(this, [this[i], i, this]);
            }
        };
    }
}());

module.exports = obj;