"use strict";

var HashMap = require("dw/util/HashMap");
var Template = require("dw/util/Template");
var money = require("dw/value/Money");
var collections = require("*/cartridge/scripts/util/collections");

function getRootPriceBook(priceBook) {
    var rootPriceBook = priceBook;
    while (rootPriceBook.parentPriceBook) {
        rootPriceBook = rootPriceBook.parentPriceBook;
    }
    return rootPriceBook;
}

function getHtmlContext(keyMap) {
    var context = new HashMap();
    Object.keys(keyMap).forEach(function(key) {
        context.put(key, keyMap[key]);
    });
    return context;
}

function getPromotionPrice(product, promotions, currentOptionModel) {
    var PROMOTION_CLASS_PRODUCT = require("dw/campaign/Promotion").PROMOTION_CLASS_PRODUCT;
    var price = money.NOT_AVAILABLE;
    var promotion = collections.find(promotions, function(promo) {
        return promo.promotionClass && promo.promotionClass.equals(PROMOTION_CLASS_PRODUCT);
    });

    if (promotion) {
        price = currentOptionModel
            ? promotion.getPromotionalPrice(product, currentOptionModel)
            : promotion.getPromotionalPrice(product, product.optionModel);
    }

    return price;
}
function renderHtml(context, templatePath) {
    var html;
    var path = templatePath || "product/components/pricing/ajaxMain.isml";
    var tmpl = new Template(path);
    html = tmpl.render(context);

    return html.text;
}
function calculateReducedPercentage(initialPrice, lastPrice) {
    var sale = Math.round(((initialPrice - lastPrice) / initialPrice) * 100);
    return sale;
}
module.exports = {
    getHtmlContext: getHtmlContext,
    getRootPriceBook: getRootPriceBook,
    renderHtml: renderHtml,
    getPromotionPrice: getPromotionPrice,
    calculateReducedPercentage: calculateReducedPercentage
};
