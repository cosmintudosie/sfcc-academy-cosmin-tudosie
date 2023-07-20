"use strict";

$(".newsletter-modal").on("click", function(e) {
    $.spinner().start();
});

$(".newsletter-cancel-btn").on("click", function(e) {
    $.spinner().stop();
});

$(".newsletter-confirmation-btn").on("click", function(e) {
    e.preventDefault();

    var formData = {
        email: $("input[id=email]").val(),
        firstname: $("input[id=firstname]").val(),
        lastname: $("input[id=lastname]").val()
    };

    var actionUrl = $("#newsletterForm").data("action");
    var subscriptionUrl = $("#newsletterForm").data("subscription");

    var regex = /^[\w.%+-]+@[\w.-]+\.[\w]{2,6}$/;

    $.ajax({
        method: "POST",
        url: actionUrl,
        data: formData,
        dataType: "json",
        success: function(data) {
            if (
                !data.profileForm.email ||
                !data.profileForm.firstname ||
                !data.profileForm.lastname ||
                data.profileForm.email.match(regex) === null
            ) {
                $.spinner().stop();
                if (!data.profileForm.email || data.profileForm.email.match(regex) === null) {
                    $("#email").css({ border: "#c00 1px solid" });
                }
                if (!data.profileForm.firstname) {
                    $("#firstname").css({ border: "#c00 1px solid" });
                }
                if (!data.profileForm.lastname) {
                    $("#lastname").css({ border: "#c00 1px solid" });
                }
            } else {
                $.spinner().stop();
                window.location.href = `${subscriptionUrl}?email=${data.profileForm.email}&fname=${data.profileForm.firstname}&lname=${data.profileForm.lastname}`;
            }
        },
        error: function(err) {
            console.error(err);
            $.spinner().stop();
        }
    });
});
