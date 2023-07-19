"use strict";
var Status = require("dw/system/Status");
var Logger = require("dw/system/Logger");

function execute(args) {
    if (empty(args.firstParam || args.secondParam || args.thirdParam)) {
        Logger.error("Please set the folowing parameters(firstParam,secondParam,thirdParam)");
        return new Status(Status.ERROR, "ERROR");
    }
    var statusOk = true;

    try {
        Logger.info("Your script parameters are: {0} {1} {2} !", args.firstParam, args.secondParam, args.thirdParam);
        statusOk = true;
    } catch (error) {
        statusOk = false;
        Logger.error(error.message);
    }
    if (statusOk) {
        return new Status(Status.OK, "OK");
    } else {
        return new Status(Status.ERROR, "ERROR");
    }
}

exports.execute = execute;
