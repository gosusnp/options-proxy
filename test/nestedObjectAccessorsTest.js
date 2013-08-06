describe("Nested objects accessors", function() {

    it("tests the getter", function() {
        expect(optionsProxy.nestedObjectGet({a: {b: {c: 51}}}, 'a.b.c')).toEqual(51);
        expect(optionsProxy.nestedObjectGet({a: {b: {c: 51}}}, 'a.b')).toEqual({c: 51});
        expect(optionsProxy.nestedObjectGet({a: {b: {c: 51}}}, 'a')).toEqual({b: {c: 51}});
    });

    it("tests the setter", function() {
        var obj;
        obj = {};
        optionsProxy.nestedObjectSet(obj, 'a', {b: {c: 51}});
        expect(obj).toEqual({a: {b: {c: 51}}});
        obj = {};
        optionsProxy.nestedObjectSet(obj, 'a.b', {c: 51});
        expect(obj).toEqual({a: {b: {c: 51}}});
        obj = {};
        optionsProxy.nestedObjectSet(obj, 'a.b.c', 51);
        expect(obj).toEqual({a: {b: {c: 51}}});

        optionsProxy.nestedObjectSet(obj, 'a.d', 45);
        expect(obj).toEqual({a: {b: {c: 51}, d: 45}});
    });
});
