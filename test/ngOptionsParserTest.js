describe("ngOptionsParser", function() {
    it("should test basic patterns for ngOptionsParser", function() {
        expect(ngOptionsParser("obj.name for obj in objects")).toEqual({
            attributeName: 'name',
            values: 'objects',
            ngOptionString: 'obj.name as obj.name for obj in objects',
        });
    });

    it("is a pattern test with filter", function() {
        expect(ngOptionsParser("obj.name for obj in objects | filter: {type: 'object'}")).toEqual({
            attributeName: 'name',
            values: 'objects',
            ngOptionString: 'obj.name as obj.name for obj in objects | filter: {type: \'object\'}',
        });
    });

    it("is a pattern test (2)", function() {
        expect(ngOptionsParser("obj.name for obj in objects| filter: {type: 'object'}")).toEqual({
            attributeName: 'name',
            values: 'objects',
            ngOptionString: 'obj.name as obj.name for obj in objects| filter: {type: \'object\'}',
        });
    });

    it("is an pattern test (3)", function() {
        expect(ngOptionsParser("t as t.name for t in types | filter: {type: 'object'}")).toEqual({
            attributeName: 'name',
            values: 'types',
            ngOptionString: "t.name as t.name for t in types | filter: {type: 'object'}",
        });
    });

    it("is an pattern test (4)", function() {
        expect(ngOptionsParser("t as t.name group by (t.subtype + ' ' + t.type) for t in types")).toEqual({
            attributeName: 'name',
            values: 'types',
            ngOptionString: "t.name as t.name group by (t.subtype + ' ' + t.type) for t in types",
        });
    });
});
