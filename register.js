var emailField = document.getElementById('email-address')
    , confirmEmailField = document.getElementById('confirm-email-address');

function validateEmail(){
    if(emailField.value.trim() != confirmEmailField.value.trim()) {
        confirmEmailField.setCustomValidity('Please enter the same email address again.');
    } else {
        confirmEmailField.setCustomValidity('');
    }

    if(	emailField.validity.typeMismatch ) {
        emailField.setCustomValidity('Please enter a valid email address.');
    } else {
        emailField.setCustomValidity('');
    }

    if( emailField.validity.patternMismatch ) {
        emailField.setCustomValidity('Please enter no more than 128 characters.');
    } else {
        emailField.setCustomValidity('');
    }
}

emailField.onchange = validateEmail;
confirmEmailField.oninput = validateEmail;

$(function () {


    function isVisible(element) {
        return element.offsetWidth > 0 && element.offsetHeight > 0;
    }

    function detectTouchscreen() {
        var result = false;
        if (window.PointerEvent && ('maxTouchPoints' in navigator)) {
            // if Pointer Events are supported, just check maxTouchPoints
            if (navigator.maxTouchPoints > 0) {
                result = true;
            }
        } else {
            // no Pointer Events...
            if (window.matchMedia && window.matchMedia("(any-pointer:coarse)").matches) {
                // check for any-pointer:coarse which mostly means touchscreen
                result = true;
            } else if (window.TouchEvent || ('ontouchstart' in window)) {
                // last resort - check for exposed touch events API / event handler
                result = true;
            }
        }
        return result;
    }

    var slim = [];

    if (!detectTouchscreen()) {
        $('.select select').each(function() {
            slim[this.id] = new SlimSelect({
                select: '#' + this.id,
                placeholder: 'Choose one...'
            });
        });
    }

    $('.is-multiple select').each(function() {
        slim[this.id] = new SlimSelect({
            select: '#' + this.id,
            placeholder: 'Choose many...'
        });
    });

    $('#register').on('submit', function(e) {

        e.preventDefault();

        if(!$("[name='nonce']").length) {
            $('<input>').attr('type', 'hidden').attr('name', 'nonce').attr('value', formToken).appendTo('#register');
        }

        var formData = new FormData(e.target);

        $('.button-register').addClass('is-loading');

        var $inputs = $(this).find("input, select, button, textarea");

        $inputs.prop('disabled', true);

        axios.post($(this).attr('action'), formData)
            .then(function(response) {
                var $formContainer = $('#form-container');
                var $webinarSuccess = $('#webinar-success');
                var $joinUrl = $('a.join-url');
                var $webinarDate = ( isVisible($('.webinar-date-mobile')) ) ? $('.webinar-date-mobile') : $('.webinar-date-desktop');
                var $webinarOccurrences = $($webinarDate, '.webinar-times li:first');

                $joinUrl.attr('href', response.data.join_url);
                $joinUrl.html(response.data.join_url);

                if( $webinarOccurrences.length ) {
                    $('.webinar-join-date').html( '<strong>Date:</strong> ' +$webinarOccurrences.clone().text() );
                } else {
                    $('.webinar-join-date').html( '<strong>Date:</strong> ' + $($webinarDate, 'p').clone().text() );
                }

                $('#form-error').hide();
                $formContainer.addClass('is-hidden');
                $webinarSuccess.removeClass('is-hidden');
            })
            .catch(function(error) {
                var $errorElement = $('#form-error');

                if(typeof error.response.data !== 'undefined' && error.response.data.code) {
                    $errorElement.html( 'Sorry, there was an error with your registration. Please contact <a href="mailto:&#115;&#117;&#112;&#112;&#111;&#114;&#116;&#064;&#099;&#121;&#098;&#101;&#114;&#115;&#105;&#103;&#104;&#116;&#046;&#111;&#114;&#103;">support@cybersight.org</a> for help.' );
                    $errorElement.removeClass('is-hidden');
                    $errorElement[0].scrollIntoView();
                }
            })
            .then(function() {
                $inputs.prop('disabled', false);
                $('.button-register').removeClass('is-loading');
            });

        return false;
    });

    $('.timezone-switcher').on('click', function(e) {
        e.preventDefault();
        $('#timezone-modal').addClass('is-active');
        $('html').addClass('is-clipped');
    });

    $('.modal-cancel').on('click', function(e) {
        e.preventDefault();
        $('#timezone-modal').removeClass('is-active');
        $('html').removeClass('is-clipped');
    });

    $('#switch-timezone').on('click', function(e) {
        e.preventDefault();

        var pathname = window.location.pathname;

        pathname = pathname.substring(0, pathname.indexOf('tz/'));

        var selectedTz = (detectTouchscreen()) ? $('#switch-time-zone').val() : slim['switch-time-zone'].selected();

        if(pathname) {
            window.location.pathname = pathname + 'tz/' + selectedTz;
        } else {
            window.location.pathname = window.location.pathname + '/tz/' + selectedTz;
        }
    });
});
