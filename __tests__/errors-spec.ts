import errors from "./../errors";
describe("Errors", () => {
    it("unknown error type", () => {
        expect(errors.unknownTransportType("test1", "test2")).toMatchSnapshot();
    });
});
