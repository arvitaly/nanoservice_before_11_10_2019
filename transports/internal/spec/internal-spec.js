// @flow
var nanoservice = require('nanoservice');
var internalTransport = require('./../index');
nanoservice.use("internal", internalTransport);
describe("Internal communication", () => {
    it("in", () => {
        var test;
        var fixture1 = "data15674";
        nanoservice({
            in: {
                inInternal1: (data) => {
                    test = data;
                }
            }
        },
            {
                transports: {
                    trInternal1: {
                        type: "internal",
                        opts: {

                        }
                    }
                },
                links: [
                    {
                        type: "in",
                        transport: "trInternal1",
                        name: "inInternal1",
                        to: "inInternal2"
                    }
                ]
            }
        );
        global['___nanoservices']["default"].emit("inInternal2", fixture1);
        expect(test).toBe(fixture1);
    })
    it("out", (done) => {
        var fixture1 = "data15674";
        nanoservice({
            out: {
                outInternal1: (cb) => {
                    cb(fixture1);
                }
            }
        },
            {
                transports: {
                    trInternal1: {
                        type: "internal",
                        opts: {

                        }
                    }
                },
                links: [
                    {
                        type: "out",
                        transport: "trInternal1",
                        name: "outInternal1",
                        to: "outInternal2"
                    }
                ]
            }
        );
        global['___nanoservices']["default"].on("outInternal2", (data) => {
            expect(data).toBe(fixture1);
            done();
        });

    })
})