import { EventEmitter2 } from "eventemitter2";
import errors from "./errors";
import { } from "./typings";
export interface IOpts {
    transports: { [index: string]: ITransportClass };
}
export default (opts?: IOpts) => {
    const realOpts = Object.assign({
        transports: {},
    } as { transports: { [index: string]: ITransportClass } }, opts);
    const nanoserviceModule: NanoserviceFactory = (service, config) => {
        config = Object.assign({
            args: null,
            services: {},
            transports: {},
            links: [],
            env: {},
        }, config);
        const emitter: INanoservice = new EventEmitter2({}) as INanoservice;
        const ins = service({
            args: config.args,
            out: (name, data) => {
                emitter.emit(name, data);
            },
            env: (name) => {
                if (typeof (config.env) !== "undefined" && typeof (config.env[name]) !== "undefined") {
                    return config.env[name];
                }
                throw new Error("Unknown environment variable: " + name);
            },
        });
        if (typeof (ins) !== "undefined") {
            Object.keys(ins).map((inName) => {
                emitter.on(inName, ins[inName]);
            });
        }
        let transports: { [index: string]: ITransport } = {};
        // Add transports
        if (typeof (config.transports) !== "undefined") {
            const configTransports = config.transports;
            Object.keys(configTransports).map((transportName) => {
                const transportConfig = configTransports[transportName];
                const transportClass = realOpts.transports[transportConfig.type];
                if (!transportClass) {
                    throw new Error(errors.unknownTransportType(transportName, transportConfig));
                }
                transports[transportName] = transportClass(transportConfig.opts);
            });
        }
        if (typeof (config.links) !== "undefined") {
            config.links.map((link) => {
                switch (link.type) {
                    case "in":
                        transports[link.transport].in(link.to, emitter.emit.bind(emitter, link.name));
                        break;
                    case "out":
                        emitter.on(link.name, transports[link.transport].out(link.to));
                        break;
                    default:
                }
            });
            emitter.links = config.links;
        } else {
            emitter.links = [];
        }
        return emitter;
    };
    return nanoserviceModule;
};
export type ITransportClass = (opts: any) => ITransport;

export type ITransport = {
    in: (name: string, cb: (data: any) => any) => any;
    out: (name: string) => (data: any) => any;
};
export type NanoserviceFactory = (service: IService, config: IServiceConfig) => INanoservice;
export interface INanoservice extends EventEmitter2 {
    links: ILink[];
}
export type IService = (opts: IServiceOpts) => { [index: string]: (data: any) => any } | undefined | void;
export type IServiceOpts = {
    args: any;
    out: (name: string, data: any) => any;
    env: (name: string) => any;
};
export type ILink = {
    transport: string;
    type: "in" | "out";
    name: string;
    to: string;
};
export type IServiceConfig = {
    transports?: { [index: string]: IServiceTransport };
    links?: ILink[];
    args?: any;
    env?: { [index: string]: any };
};
export type IServiceTransport = {
    opts?: any;
    type: string;
};
