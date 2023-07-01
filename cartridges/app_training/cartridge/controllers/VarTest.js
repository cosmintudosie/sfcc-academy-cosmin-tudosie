"use strict";
var server = require("server");

server.get("Test", function(req, res, next) {
    res.render("test/vartest");
    return next();
});
module.exports = server.exports();
