var server = require('./../index');
var fetch = require('node-fetch');
var nanoservice = require('nanoservice');
nanoservice.use("internal", require('nanoservice-transport-internal'));
describe("Nanoservices server", () => {
    it("start", (done) => {
        var fixture1 = "test123";
        var fixture2 = "t567";
        var fixture3 = "t0987";

        var service1 = {
            in: {
                in1: (data) => {
                    expect(data).toBe(fixture1);
                    done();
                }
            },
            start: () => {
                return new Promise((resolve) => {
                    resolve(fixture2)
                })
            }
        }
        var service2 = {
            out: {
                out1: (cb) => {
                    setTimeout(() => {
                        cb(fixture1)
                    }, 50)
                }
            },
            start: () => {
                return new Promise((resolve) => {
                    resolve(fixture3)
                })
            }
        }
        server({
            address: 19091,
            services: {
                service1: service1,
                service2: service2
            }
        }, () => {
            var conf1 = {
                "transports": { "tr1": { "type": "internal" } }, "links": [{
                    type: "in",
                    transport: "tr1",
                    name: "in1",
                    to: "link1"
                }]
            }
            var conf2 = {
                "transports": { "tr1": { "type": "internal" } }, "links": [{
                    type: "out",
                    transport: "tr1",
                    name: "out1",
                    to: "link1"
                }]
            }
            fetch('http://127.0.0.1:19091/service/service1/start?config=' + encodeURIComponent(JSON.stringify(conf1))).then((body) => {
                return body.json();
            }).then((res) => {
                expect(res).toEqual({ status: "ok", result: fixture2 });
                return fetch('http://127.0.0.1:19091/service/service2/start?config=' + encodeURIComponent(JSON.stringify(conf2)));
            }).then((body) => {
                return body.json();
            }).then((res) => {
                expect(res).toEqual({ status: "ok", result: fixture3 });
            })
        })
    })
})