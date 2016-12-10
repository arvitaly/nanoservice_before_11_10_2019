"use strict";
const errors_1 = require("./../errors");
describe("Errors", () => {
    it("unknown error type", () => {
        expect(errors_1.default.unknownTransportType("test1", "test2")).toMatchSnapshot();
    });
});
