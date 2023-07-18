"use strict";

var server = require("server");
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

server.get(
    "NewsletterForm",

    function(req, res, next) {
        var Resource = require("dw/web/Resource");
        var URLUtils = require("dw/web/URLUtils");
        var AccountModel = require("*/cartridge/models/account");
        var accountModel = getModel(req);
        var newsletterForm = server.forms.getForm("newsletterForm");
        newsletterForm.clear();

        res.render("subscribeNewsletter/newsletter", {
            newsletterForm: newsletterForm
        });
        next();
    }
);

server.post("Submit", function(req, res, next) {
    var Transaction = require("dw/system/Transaction");
    //var CustomerMgr = require("dw/customer/CustomerMgr");
    var CustomObjectMgr = require("dw/object/CustomObjectMgr");
    var Resource = require("dw/web/Resource");
    var URLUtils = require("dw/web/URLUtils");
    var accountHelpers = require("*/cartridge/scripts/helpers/accountHelpers");
    var Cupon = require("dw/campaign/Coupon");
    var CouponMgr = require("dw/campaign/CouponMgr");
    var formErrors = require("*/cartridge/scripts/formErrors");
    var Mail = require("dw/net/Mail");
    var emailHelpers = require("*/cartridge/scripts/helpers/emailHelpers");
    var newsletterForm = server.forms.getForm("newsletterForm");

    var email = newsletterForm.email.value;
    var firstname = newsletterForm.firstname.value;
    var lastname = newsletterForm.lastname.value;
    var fullName = firstname + " " + lastname;

    var newsletter = CustomObjectMgr.getCustomObject("NewsletterSubscription", email);
    var coupon = CouponMgr.getCoupon("$20 bonus");
    var couponCode;
    var message = Resource.msg("subscribed.message", "newsletter", null);
    var emailMessage;

    if (newsletter) {
        message = Resource.msg("error.email.already.exists", "newsletter", null);
    } else {
        Transaction.wrap(function() {
            newsletter = CustomObjectMgr.createCustomObject("NewsletterSubscription", email);
            newsletter.custom.lastName = lastname;
            newsletter.custom.firstName = firstname;
            couponCode = coupon.getNextCouponCode();
        });

        //SEND EMAIL
        var emailSender = dw.system.Site.getCurrent().getPreferences().custom.customerServiceEmail;
        var emailObj = {
            to: email,
            subject: "Newsletter sign up",
            from: emailSender,
            type: emailHelpers.emailTypes.registration
        };

        if (!couponCode) {
            emailMessage = Resource.msg("email.message.nocoupon", "newsletter", null);
        } else {
            emailMessage = Resource.msgf("email.message.coupon.code", "newsletter", null, couponCode);
        }
        var objectForEmail = {
            name: fullName,
            email: email,
            emailMessage: emailMessage
        };

        var template = "subscribeNewsletter/newsletterMail";
        emailHelpers.sendEmail(emailObj, template, objectForEmail);
    }
    res.render("subscribeNewsletter/succes", { message: message });
    return next();
});

module.exports = server.exports();
