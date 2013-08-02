describe("ngOptionsParser", function() {
    it("should test basic patterns for ngOptionsParser", function() {
        expect(ngOptionsParser("obj.name for obj in objects")).toEqual({
            attributeName: 'name',
            optionList: 'objects',
            ngOptionString: 'obj.name as obj.name for obj in objects',
        });
    });
});
