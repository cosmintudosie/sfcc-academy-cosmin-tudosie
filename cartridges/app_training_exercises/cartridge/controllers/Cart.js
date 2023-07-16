"use strict";
var server = require("server");
server.extend(module.superModule);

server.append("Show", function(req, res, next) {
    var viewData = res.getViewData();
    var BasketMgr = require("dw/order/BasketMgr");

    var currentBasket = BasketMgr.getCurrentBasket();
    var totalPrice = currentBasket.getMerchandizeTotalPrice().value;
    var threshold = dw.system.Site.getCurrent().getPreferences().custom.cartLimit;
    viewData.totalPrice = totalPrice;
    viewData.threshold = threshold;
    res.setViewData(viewData);
    return next();
});

module.exports = server.exports();
