"use strict";
var server = require("server");

server.extend(module.superModule);

server.append("Show", function(req, res, next) {
    var viewData = res.getViewData();
    viewData.example = "One string or another";

    res.setViewData(viewData);
   // res.render("test/vartest");
    return next();
});

module.exports = server.exports();
