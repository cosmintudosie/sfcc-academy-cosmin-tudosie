"use strict";
var server = require("server");

server.get("Test", function(req, res, next) {
    var string = "Hello World"
    res.render("test/vartest", {string:string});
    return next();
});
module.exports = server.exports();
