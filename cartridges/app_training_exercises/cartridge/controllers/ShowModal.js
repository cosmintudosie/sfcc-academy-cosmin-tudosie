"use strict";

var server = require("server");
server.get(
    "Modal",

    function(req, res, next) {
        res.render("subscribeNewsletter/modal");
        return next();
    }
);

module.exports = server.exports();
