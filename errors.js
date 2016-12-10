"use strict";
let code = 0;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    unknownTransportType: (type, opts) => {
        return "Unknown transport type:: " + type + " for transport " + JSON.stringify(opts);
    },
};
