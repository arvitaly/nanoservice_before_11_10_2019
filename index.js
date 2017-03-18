"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
;
exports.default = (emitter, config) => {
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
