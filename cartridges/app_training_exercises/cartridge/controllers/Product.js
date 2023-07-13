"use strict";
var server = require("server");

server.extend(module.superModule);

server.append("Show", function(req, res, next) {
    var CatalogMgr = require("dw/catalog/CatalogMgr");
    var ProductMgr = require("dw/catalog/ProductMgr");
    var ProductSearchModel = require("dw/catalog/ProductSearchModel");
    var viewData = res.getViewData();

    var productID = ProductMgr.getProduct(req.querystring.pid);
    var categoryId = productID.getPrimaryCategory().ID;

    var sortingRule = CatalogMgr.getSortingRule("price-low-to-high");
    var apiProductSearch = new ProductSearchModel();
    apiProductSearch.setSortingRule(sortingRule);
    apiProductSearch.setCategoryID(categoryId);

    apiProductSearch.search();

    // res.render("test/vartest");
    viewData.apiProductSearch = apiProductSearch;
    viewData.currentProductId = req.querystring.pid;
    res.setViewData(viewData);
    return next();
});

module.exports = server.exports();
