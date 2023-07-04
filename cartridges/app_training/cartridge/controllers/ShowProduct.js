"use strict";
var server = require("server");

server.get("Product", function(req, res, next) {
    var ProductMgr = require("dw/catalog/ProductMgr");
    var product = ProductMgr.getProduct("008884304009M");
    res.render("test/newtest", { product: product });
    next();
});
server.get("RenderTemplate", function(req, res, next) {
    res.render("test/dummy");
    next();
});
server.get("TestRemoteInclude", function(req, res, next) {
    res.render("test/includeDummy");
    next();
});
server.get("TestDecorator", function(req, res, next) {
    res.render("test/decorator");
    next();
});
module.exports = server.exports();
