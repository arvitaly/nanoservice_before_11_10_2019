var nanoservice = require('nanoservice');
var errors = require('./errors');
var express = require('express');
module.exports = (opts/*:{address:string, services:{}}*/, callback) => {
    return new Server(opts, callback);
}
var Server = function (opts, callback) {
    var app = express();

    opts = opts || {}
    opts.address = opts.address || 19090
    var servicesConfig = opts.services || {};

    this.services = {}
    app.get("/service/:name/start", (req, res) => {
        console.log("Request:: service " + req.params.name + " start ")
        var service = servicesConfig[req.params.name];
        if (!service) {
            error(res, errors.unknownService(req.params.name));
            return;
        }
        try {
            var config = req.query.config ? JSON.parse(req.query.config) : {};
            nanoservice(service, config);
        } catch (e) {
            error(res, e);
            return;
        }
        var p;
        if (service.start) {
            p = service.start();
        } else {
            p = Promise.resolve();
        }
        p.then((result) => {
            res.send({ status: "ok", result: result });
        }).catch((e) => {
            error(res, e);
        })
    });
    app.get("/service/:name/stop", (req, res) => {
        var service = servicesConfig[req.params.name];
        if (!service) {
            error(res, errors.unknownService(req.params.name));
            return;
        }
        var p;
        if (service.stop) {
            p = service.stop();
        } else {
            p = Promise.resolve();
        }
        p.then((result) => {
            res.send({ status: "ok", result: result });
        }).catch((e) => {
            error(res, e);
        })
    })

    app.listen(opts.address, (err) => {
        if (!err) {
            console.log("Nanoservices server listening on " + opts.address);
        }
        if (callback) {
            callback(err);
        }

    });
}
function error(res, err) {
    res.status(500).send({ status: "error", error: err })
}