let code = 0;
export default {
    unknownTransportType: (type: string, opts: any) => {
        return "Unknown transport type:: " + type + " for transport " + JSON.stringify(opts);
    },
};
