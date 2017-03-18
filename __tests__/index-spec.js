"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const eventemitter3_1 = require("eventemitter3");
const _1 = require("./../");
const fixture1 = "fix1";
const fixture2 = "fix2";
const fixture3 = "fix3";
const fixture4 = "fix4";
class Service1 extends eventemitter3_1.EventEmitter {
    constructor(args) {
        super();
        this.on("in1", (a) => {
            this.emit("out1", args + a + fixture2 + fixture3);
        });
    }
}
describe("NanoService", () => {
    describe("Transport", () => {
        let inTransportSpy;
        let transportSpy;
        let serviceLinkSpy;
        let outTransportSpy;
        let outTransportCallbackSpy;
        beforeEach(() => {
            inTransportSpy = jest.fn();
            // Add transport out spy
            outTransportCallbackSpy = jest.fn();
            outTransportSpy = jest.fn(() => {
                return outTransportCallbackSpy;
            });
            // Create transport
            transportSpy = { in: inTransportSpy, out: outTransportSpy };
            serviceLinkSpy = jest.fn();
        });
        it("when set transport and in-link", () => {
            const serviceSpy = new Service1(fixture2);
            serviceSpy.on("in1", (data) => {
                serviceLinkSpy(data);
            });
            // Create nanoservice
            _1.default(serviceSpy, {
                links: [{ type: "in", name: "in1", transport: transportSpy, to: fixture2 }],
            });
            // Check transport in-subscribe
            expect(inTransportSpy.mock.calls.length).toBe(1);
            expect(inTransportSpy.mock.calls[0][0]).toBe(fixture2);
            // Call transport in-link
            inTransportSpy.mock.calls[0][1](fixture3);
            // Check service in1 call
            expect(serviceLinkSpy.mock.calls).toEqual([[fixture3]]);
        });
        it("when set transport and out-link", () => {
            // Create nanoservice
            const serviceSpy = new Service1(fixture2);
            _1.default(serviceSpy, {
                links: [{ type: "out", name: fixture1, transport: transportSpy, to: fixture2 }],
            });
            // Check transport out-subscribe
            expect(outTransportSpy.mock.calls).toEqual([[fixture2]]);
            // Subscribe on service
            serviceSpy.emit(fixture1, fixture3);
            // Check transport out call
            expect(outTransportCallbackSpy.mock.calls).toEqual([[fixture3]]);
        });
    });
});
