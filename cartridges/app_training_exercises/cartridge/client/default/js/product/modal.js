"use strict";
var formValidation = require("../components/formValidation");
var createErrorNotification = require("../components/errorNotification");

module.exports = {
    login: function() {
        $("form.login").submit(function(e) {
            var form = $(this);
            e.preventDefault();
            var url = form.attr("action");
            form.spinner().start();
            $("form.login").trigger("login:submit", e);
            $.ajax({
                url: url,
                type: "post",
                dataType: "json",
                data: form.serialize(),
                success: function(data) {
                    form.spinner().stop();
                    if (!data.success) {
                        formValidation(form, data);
                        $("form.login").trigger("login:error", data);
                    } else {
                        $("form.login").trigger("login:success", data);
                        location.href = data.redirectUrl;
                    }
                },
                error: function(data) {
                    if (data.responseJSON.redirectUrl) {
                        window.location.href = data.responseJSON.redirectUrl;
                    } else {
                        $("form.login").trigger("login:error", data);
                        form.spinner().stop();
                    }
                }
            });
            return false;
        });
    }
};

