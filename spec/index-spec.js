var mock = require('mock2');
var errors = require('./../errors');
var fixture1 = "fix1";
var fixture2 = "fix2";
var fixture3 = "fix3";
var fixture4 = "fix4";
describe("NanoService", () => {
    var Nanoservice;
    var ServiceController;
    beforeAll(() => {
        ServiceController = jasmine.createSpy();
        Nanoservice = mock.require('./../index',{
            './../services': ServiceController
        });
    })
    beforeEach(()=>{
        ServiceController.calls.reset();
    })
    it("when create without links and transports should work as event emitter with args and env", () => {
        var service1 = (opts) => {
            return {
                in1: (a) => {
                    opts.out.emit("out1", opts.args + a + fixture2 + opts.env("env1"))
                }
            }
        }
        var nanoservice = Nanoservice();
        var n1 = nanoservice(service1, {
            args: fixture4,
            env: {
                env1: fixture3
            }
        });
        var test;
        n1.on("out1", (res) => {
            test = res;
        })
        n1.emit("in1", fixture1);
        expect(test).toBe(fixture4 + fixture1 + fixture2 + fixture3);
    })
    it("when transport not setted should throw error", () => {
        var nanoservice = Nanoservice();
        expect(nanoservice.bind(undefined, () => { }, {
            transports: { "t": { type: fixture1, opts: fixture2 } }
        })).toThrow(new Error(errors.unknownTransportType({
            type: fixture1,
            transport: fixture2
        })))
    })
    it("when transport setted, opts should be equal", () => {
        var transport = jasmine.createSpy();
        var nanoservice = Nanoservice({
            transports: {
                "tr1": transport
            }
        });
        nanoservice(() => { }, {
            transports: { "t": { type: "tr1", opts: fixture1 } }
        })
        expect(transport.calls.allArgs()).toEqual([[fixture1]]);
    })
    describe("Transport", () => {
        var inTransportSpy, transportSpy, serviceSpy, serviceLinkSpy, outTransportSpy, nanoservice;
        beforeEach(() => {
            //Create transport            
            transportSpy = jasmine.createSpy();
            inTransportSpy = jasmine.createSpy();
            outTransportSpy = jasmine.createSpy();
            transportSpy.and.returnValue({ in: inTransportSpy, out: outTransportSpy });
            //Create service
            serviceSpy = jasmine.createSpy();
            serviceLinkSpy = jasmine.createSpy();
            //Init nanoservice module with transport
            nanoservice = Nanoservice({ transports: { "tr1": transportSpy } });
        })
        it("when set transport and in-link", () => {
            serviceSpy.and.returnValue({
                in1: serviceLinkSpy
            });
            //Create nanoservice
            nanoservice(serviceSpy, {
                transports: { "t": { type: "tr1" } },
                links: [{ type: "in", name: "in1", transport: "t", to: fixture2 }]
            });
            //Check transport in-subscribe
            expect(inTransportSpy.calls.count()).toBe(1);
            expect(inTransportSpy.calls.argsFor(0)[0]).toBe(fixture2);
            //Call transport in-link
            inTransportSpy.calls.argsFor(0)[1](fixture3);
            //Check service in1 call
            expect(serviceLinkSpy.calls.allArgs()).toEqual([[fixture3]]);
        })
        it("when set transport and out-link", () => {
            //Add transport out spy
            var outTransportCallbackSpy = jasmine.createSpy();
            outTransportSpy.and.returnValue(outTransportCallbackSpy);
            //Create nanoservice
            var nanoservice1 = nanoservice(serviceSpy, {
                transports: { "t": { type: "tr1" } },
                links: [{ type: "out", name: fixture1, transport: "t", to: fixture2 }]
            });
            //Check transport out-subscribe            
            expect(outTransportSpy.calls.allArgs()).toEqual([[fixture2]]);
            //Subscribe on service 
            nanoservice1.emit(fixture1, fixture3);
            //Check transport out call
            expect(outTransportCallbackSpy.calls.allArgs()).toEqual([[fixture3]]);
        })
    })
    describe("Sub services", () => {
        it("when create service, service-controller should be created", () => {
            var service1 = jasmine.createSpy();
            ServiceController.and.returnValue(fixture2)
            Nanoservice()(service1, {
                services: {
                    "service2Class": fixture1
                }
            });            
            expect(ServiceController.calls.allArgs()).toEqual([[{ "service2Class": fixture1 }]]);
            expect(service1.calls.argsFor(0)[0].services).toBe(fixture2);
            
        })
    })
})