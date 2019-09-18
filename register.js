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
}

emailField.onchange = validateEmail;
confirmEmailField.onkeyup = validateEmail;

$(function () {


    function isVisible(element) {
        return element.offsetWidth > 0 && element.offsetHeight > 0;
    }

    if (!/Android|webOS|iPhone|iPad|BlackBerry|Windows Phone|Opera Mini|IEMobile|Mobile/i.test(navigator.userAgent)) {
        var slim = [];

        $('.select select').each(function() {
            slim[this.id] = new SlimSelect({
                select: '#' + this.id,
                placeholder: 'Choose one...'
            });
        });
    }

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
                var $webinarDate = ( isVisible($('.webinar-date-mobile p')) ) ? $('.webinar-date-mobile p') : $('.webinar-date-desktop p');

                $joinUrl.attr('href', response.data.join_url);
                $joinUrl.html(response.data.join_url);

                $('.webinar-join-date').html( '<strong>Date:</strong> ' + $webinarDate.clone().text() );

                $('#form-error').hide();
                $formContainer.addClass('is-hidden');
                $webinarSuccess.removeClass('is-hidden');
            })
            .catch(function(error) {
                var $errorElement = $('#form-error');

                if(typeof error.response.data !== 'undefined' && error.response.data.code) {
                    $errorElement.html(error.response.data.message);
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

        var selectedTz = (typeof slim !== 'undefined') ? slim['switch-time-zone'].selected() : $('#switch-time-zone').val();

        if(pathname) {
            window.location.pathname = pathname + 'tz/' + selectedTz;
        } else {
            window.location.pathname = window.location.pathname + '/tz/' + selectedTz;
        }
    });
});
