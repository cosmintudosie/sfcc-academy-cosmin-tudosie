"use strict";
var server = require("server");

server.get("ShowProd", function(req, res, next) {
    res.render("cart/vartest");
});
module.exports = server.exports();
