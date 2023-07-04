"use strict";
var server = require("server");

server.get("Product", function(req, res, next) {
    var ProductMgr = require("dw/catalog/ProductMgr");
    var product = ProductMgr.getProduct(req.querystring.pid);
    res.render("test/newtest2", { product: product });
    next();
});
module.exports = server.exports();
