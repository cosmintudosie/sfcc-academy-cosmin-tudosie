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
server.append("AddProduct", function(req, res, next) {
    var Mail = require("dw/net/Mail");
    var BasketMgr = require("dw/order/BasketMgr");
    var ProductMgr = require("dw/catalog/ProductMgr");
    var Resource = require("dw/web/Resource");
    var URLUtils = require("dw/web/URLUtils");
    var emailHelpers = require("*/cartridge/scripts/helpers/emailHelpers");

    var viewData = res.getViewData();
    var currentBasket = BasketMgr.getCurrentBasket();
    var productId = req.form.pid;
    var product = ProductMgr.getProduct(productId);
    var imageUrl = product.getImage("medium").absURL.toString();
    var productUrl = URLUtils.url("Product-Show", "pid", productId)
        .abs()
        .toString();
    var customerEmail = currentBasket.customer.profile.email;
    var emailSender = dw.system.Site.getCurrent().getPreferences().custom.customerServiceEmail;
    var subject = Resource.msg("email.title", "mail", null);
    var template = "mail/cartSendEmail";

    var emailObj = {
        to: customerEmail,
        subject: subject,
        from: emailSender,
        type: emailHelpers.emailTypes.orderConfirmation
    };

    var objectForEmail = {
        productImage: imageUrl,
        productName: product.name,
        productDescription: product.shortDescription,
        productPrice: product.priceModel.price.value,
        productCurrency: product.priceModel.price.currencyCode,
        productQuantity: parseInt(req.form.quantity, 10).toFixed(),
        productUrl: productUrl
    };

    emailHelpers.sendEmail(emailObj, template, objectForEmail);

    res.setViewData(viewData);

    return next();
});
module.exports = server.exports();
