import Nanoservice, { IServiceOpts, NanoserviceFactory } from "./../";
const fixture1 = "fix1";
const fixture2 = "fix2";
const fixture3 = "fix3";
const fixture4 = "fix4";
describe("NanoService", () => {
    it("when create without links and transports should work as event emitter with args and env", () => {
        const service1 = (opts: IServiceOpts) => {
            return {
                in1: (a: any) => {
                    opts.out("out1", opts.args + a + fixture2 + opts.env("env1"));
                },
            };
        };
        const nanoservice = Nanoservice();
        const n1 = nanoservice(service1, {
            args: fixture4,
            env: {
                env1: fixture3,
            },
        });
        let test: any;
        n1.on("out1", (res: any) => {
            test = res;
        });
        n1.emit("in1", fixture1);
        expect(test).toBe(fixture4 + fixture1 + fixture2 + fixture3);
    });
    it("when transport not setted should throw error", () => {
        const nanoservice = Nanoservice();
        try {
            nanoservice(() => { /*  */ }, {
                transports: { t: { type: fixture1, opts: fixture2 } },
            });
        } catch (e) {
            expect(e).toMatchSnapshot();
        }
    });
    it("when transport setted, opts should be equal", () => {
        const transport = jest.fn();
        const nanoservice = Nanoservice({
            transports: {
                "tr1": transport,
            },
        });
        nanoservice(() => { /* */ }, {
            transports: { t: { type: "tr1", opts: fixture1 } },
        });
        expect(transport.mock.calls).toEqual([[fixture1]]);
    });
    describe("Transport", () => {
        let inTransportSpy: jest.Mock<any>;
        let transportSpy: jest.Mock<any>;
        let serviceSpy: jest.Mock<any>;
        let serviceLinkSpy: jest.Mock<any>;
        let outTransportSpy: jest.Mock<any>;
        let nanoservice: NanoserviceFactory;
        beforeEach(() => {
            // Create transport            
            transportSpy = jest.fn(() => {
                return { in: inTransportSpy, out: outTransportSpy };
            });
            inTransportSpy = jest.fn();
            outTransportSpy = jest.fn();
            // Create service
            serviceSpy = jest.fn();
            serviceLinkSpy = jest.fn();
            // Init nanoservice module with transport
            nanoservice = Nanoservice({ transports: { "tr1": transportSpy } });
        });
        it("when set transport and in-link", () => {
            serviceSpy = jest.fn(() => {
                return {
                    in1: serviceLinkSpy,
                };
            });
            // Create nanoservice
            nanoservice(serviceSpy, {
                links: [{ type: "in", name: "in1", transport: "t", to: fixture2 }],
                transports: { t: { type: "tr1" } },
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
            // Add transport out spy
            const outTransportCallbackSpy = jest.fn();
            outTransportSpy = jest.fn(() => {
                return outTransportCallbackSpy;
            });
            // Create nanoservice
            const nanoservice1 = nanoservice(serviceSpy, {
                links: [{ type: "out", name: fixture1, transport: "t", to: fixture2 }],
                transports: { t: { type: "tr1" } },
            });
            // Check transport out-subscribe            
            expect(outTransportSpy.mock.calls).toEqual([[fixture2]]);
            // Subscribe on service 
            nanoservice1.emit(fixture1, fixture3);
            // Check transport out call
            expect(outTransportCallbackSpy.mock.calls).toEqual([[fixture3]]);
        });
    });
});
