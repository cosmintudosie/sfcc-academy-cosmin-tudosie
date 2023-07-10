"use strict";

var server = require("server");

var csrfProtection = require("*/cartridge/scripts/middleware/csrf");
var userLoggedIn = require("*/cartridge/scripts/middleware/userLoggedIn");
var consentTracking = require("*/cartridge/scripts/middleware/consentTracking");

/**
 * Creates an account model for the current customer
 * @param {Object} req - local instance of request object
 * @returns {Object} a plain object of the current customer's account
 */
function getModel(req) {
    var OrderMgr = require("dw/order/OrderMgr");
    var Order = require("dw/order/Order");
    var AccountModel = require("*/cartridge/models/account");
    var AddressModel = require("*/cartridge/models/address");
    var OrderModel = require("*/cartridge/models/order");
    var Locale = require("dw/util/Locale");

    var orderModel;
    var preferredAddressModel;

    if (!req.currentCustomer.profile) {
        return null;
    }

    var customerNo = req.currentCustomer.profile.customerNo;
    var customerOrders = OrderMgr.searchOrders(
        "customerNo={0} AND status!={1}",
        "creationDate desc",
        customerNo,
        Order.ORDER_STATUS_REPLACED
    );

    var order = customerOrders.first();

    if (order) {
        var currentLocale = Locale.getLocale(req.locale.id);

        var config = {
            numberOfLineItems: "single"
        };

        orderModel = new OrderModel(order, { config: config, countryCode: currentLocale.country });
    } else {
        orderModel = null;
    }

    if (req.currentCustomer.addressBook.preferredAddress) {
        preferredAddressModel = new AddressModel(req.currentCustomer.addressBook.preferredAddress);
    } else {
        preferredAddressModel = null;
    }

    return new AccountModel(req.currentCustomer, preferredAddressModel, orderModel);
}

/**
 * Checks if the email value entered is correct format
 * @param {string} email - email string to check if valid
 * @returns {boolean} Whether email is valid
 */
function validateEmail(email) {
    var regex = /^[\w.%+-]+@[\w.-]+\.[\w]{2,6}$/;
    return regex.test(email);
}

server.get(
    "EditProfile",

    function(req, res, next) {
        var Resource = require("dw/web/Resource");
        var URLUtils = require("dw/web/URLUtils");

        var accountModel = getModel(req);
        var profileForm = server.forms.getForm("profile");
        profileForm.clear();
        // profileForm.name.value = accountModel.profile.name;
        // profileForm.customer.phone.value = accountModel.profile.phone;
        // profileForm.customer.email.value = accountModel.profile.email;
        res.render("account/editProfileForm", {
            profileForm: profileForm
        });
        next();
    }
);

server.post("SubmitProfile", function(req, res, next) {
    var Transaction = require("dw/system/Transaction");
    var CustomerMgr = require("dw/customer/CustomerMgr");
    var Resource = require("dw/web/Resource");
    var URLUtils = require("dw/web/URLUtils");
    var accountHelpers = require("*/cartridge/scripts/helpers/accountHelpers");

    var formErrors = require("*/cartridge/scripts/formErrors");

    var profileForm = server.forms.getForm("profile");

    // form validation

    var result = {
        name: profileForm.name.value,
        email: profileForm.email.value,
        confirmEmail: profileForm.emailconfirm.value,
        profileForm: profileForm
    };
    res.render("account/dataForm", {
        data: result
    });
    return next();
});

module.exports = server.exports();
