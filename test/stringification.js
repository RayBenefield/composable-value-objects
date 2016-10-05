var describe = require('tape-bdd');
var self = require('src/value-object');

describe('ValueObject stringification', function(it) {
    it('returns a stringified value', function(assert) {
        var valueObject = self.define('ValueObject', { validate: () => true });
        var object = new valueObject('test');
        assert.ok(object.toString() === '"test"');
    });

    it('returns a stringified object', function(assert) {
        var valueObject = self.define('ValueObject', { validate: () => true });
        var object = new valueObject({ test: 'string' });
        assert.ok(object.toString() === '{"test":"string"}');
    });

    it('returns a stringified object with a parsed value', function(assert) {
        var valueObject = self.define('ValueObject', {
            validate: () => true,
            preParsers: {
                value: (object) => { return { test: object.original }; }
            }
        });
        var object = new valueObject('roar');
        assert.ok(object.toString() === '{"test":"roar"}');
    });

    it('returns a stringified object with a composite object', function(assert) {
        var composite = self.define('Composite', {
            validate: (object) => object.value === 'test'
        });
        var valueObject = self.define('Value Object', {
            validate: () => true,
            composites: {
                composite: composite
            },
            preParsers: {
                composite: (object) => object.value.split('.')[1]
            }
        });
        var result = new valueObject('composite.test');
        assert.ok(result.toString() === '{"composite":"test"}');
    });

    it('returns a stringified object with multiple composite objects', function(assert) {
        var composite1 = self.define('Composite #1', {
            validate: (object) => object.value === 'test1'
        });
        var composite2 = self.define('Composite #2', {
            validate: (object) => object.value === 'test2'
        });
        var valueObject = self.define('Value Object', {
            validate: () => true,
            composites: {
                compositeOne: composite1,
                compositeTwo: composite2,
            },
            preParsers: {
                compositeOne: (object) => object.value.split('.')[0],
                compositeTwo: (object) => object.value.split('.')[1]
            }
        });
        var result = new valueObject('test1.test2');
        assert.ok(result.toString() === '{"compositeOne":"test1","compositeTwo":"test2"}');
    });

    it('returns a stringified object with multiple composite objects using an obect as a value', function(assert) {
        var composite1 = self.define('Composite #1', {
            validate: (object) => object.value === 'test1'
        });
        var composite2 = self.define('Composite #2', {
            validate: (object) => object.value === 'test2'
        });
        var valueObject = self.define('Value Object', {
            validate: () => true,
            composites: {
                compositeOne: composite1,
                compositeTwo: composite2,
            },
            preParsers: {
                compositeOne: (object) => object.value.property.split('.')[0],
                compositeTwo: (object) => object.value.property.split('.')[1]
            }
        });
        var result = new valueObject({ property: 'test1.test2' });
        assert.ok(result.toString() === '{"property":"test1.test2","compositeOne":"test1","compositeTwo":"test2"}');
    });

    it('returns a stringified object with nested composite objects', function(assert) {
        var compositeDeep = self.define('Composite Deep', {
            validate: (object) => object.original === 'test2'
        });
        var compositeShallow = self.define('Composite Shallow', {
            validate: () => true,
            composites: {
                composite: compositeDeep
            },
            preParsers: {
                composite: (object) => object.value.split(';')[1]
            }
        });
        var valueObject = self.define('Value Object', {
            validate: () => true,
            composites: {
                deep: compositeShallow,
            },
            preParsers: {
                deep: (object) => object.value.split('.')[1]
            }
        });
        var result = new valueObject('first.test1;test2');
        assert.ok(result.toString() === '{"deep":{"composite":"test2"}}');
    });
});
