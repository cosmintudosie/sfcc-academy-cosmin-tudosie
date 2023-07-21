"use strict";

var server = require("server");

server.get("Show", function(req, res, next) {
    var service = dw.svc.LocalServiceRegistry.createService("app_training_exercises.flickr", {
        createRequest: function(svc: HTTPService, args) {
            svc.setRequestMethod("GET");
        },
        parseResponse: function(svc: HTTPService, client: HTTPClient) {
            return client;
        }
    });

    var result = service.call("https://flickr.com/");
    var photosURL = [];
    var photos = result.object.text;
    var url = "https://flickr.com/";
    for (let i = 0; i < photos.length; i++) {
        photosURL.push(url + photos[i].server + "/" + photos[i].id + "_" + photos[i].secret + ".jpg");
    }
    photosURL.push(photos);

    res.render("showFlickr", { photosURL: photos });

    return next();
});

module.exports = server.exports();
