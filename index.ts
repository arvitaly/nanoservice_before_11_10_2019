import { EventEmitter } from "eventemitter3";
type ListenerFn = (...args: any[]) => void;
interface IEventEmitter {
    on(event: string | symbol, fn: ListenerFn, context?: any): this;
    emit(event: string | symbol, ...args: any[]): boolean;
}
export type LinkType = "in" | "out";
interface ILink {
    transport: ITransport;
    type: LinkType;
    name: string;
    to: string;
}
interface IConfig {
    links: ILink[];
}
export interface ITransport {
    in: (name: string, cb: (data: any) => any) => any;
    out: (name: string) => (data: any) => any;
};
export default (emitter: IEventEmitter, config: IConfig) => {
    config.links.map((link) => {
        switch (link.type) {
            case "in":
                link.transport.in(link.to, emitter.emit.bind(emitter, link.name));
                break;
            case "out":
                emitter.on(link.name, link.transport.out(link.to));
                break;
            default:
                throw new Error("Invalid link type: " + link.type);
        }
    });
};
