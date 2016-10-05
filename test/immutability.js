var describe = require('tape-bdd');
var self = require('src/value-object');

describe('ValueObject immutability', function(it) {
    it('holds true for a primitive', function(assert) {
        var valueObject = self.define('ValueObject', { validate: () => true });
        var object = new valueObject('test');
        assert.throws(() => object.value = 'roar');
    });

    it('holds true for an object', function(assert) {
        var valueObject = self.define('ValueObject', { validate: () => true });
        var object = new valueObject({ key: 'value' });
        assert.throws(() => object.key = 'roar');
    });

    it('holds true for a nested object', function(assert) {
        var valueObject = self.define('ValueObject', { validate: () => true });
        var object = new valueObject({ key: { secondKey: 'value' } });
        assert.throws(() => object.key.secondKey = 'roar');
    });

    it('holds true for a deeply nested object', function(assert) {
        var valueObject = self.define('ValueObject', { validate: () => true });
        var object = new valueObject({
            key1: {
                key2: {
                    key3: {
                        key4: {
                            key5: 'value'
                        }
                    }
                }
            }
        });
        assert.throws(() => object.key1.key2.key3.key4.key5 = 'roar');
    });

    it('holds true for a parsed properties', function(assert) {
        var valueObject = self.define('ValueObject', {
            validate: () => true,
            preParsers: {
                parsed: () => 'test'
            }
        });
        var object = new valueObject();
        assert.throws(() => object.parsed = 'roar');
    });

    it('holds true for a nested parsed properties', function(assert) {
        var valueObject = self.define('ValueObject', {
            validate: () => true,
            preParsers: {
                'parsed.nested': (valueObject) => valueObject.value.split('.')[1],
            }
        });
        var object = new valueObject('test.parsed');
        assert.throws(() => object.parsed.nested = 'roar');
    });

    it('holds true for deeply nested parsed properties', function(assert) {
        var valueObject = self.define('ValueObject', {
            validate: () => true,
            preParsers: {
                'parsed.nested.again.and.again': (valueObject) => valueObject.value.split('.')[1],
            }
        });
        var object = new valueObject('test.parsed');
        assert.throws(() => object.parsed.nested.again.and.again = 'roar');
    });

    it('stops post parsers from editing the value', function(assert) {
        var valueObject = self.define('ValueObject', {
            validate: () => true,
            postParsers: {
                value: () => 'changed'
            }
        });
        var object = new valueObject('test');
        assert.ok(object.value !== 'changed');
    });

    it('stops post parsers from editing properties from pre parsers', function(assert) {
        var valueObject = self.define('ValueObject', {
            validate: () => true,
            preParsers: {
                property: () => 'added'
            },
            postParsers: {
                anotherProperty: (valueObject) => valueObject.property = 'changed'
            }
        });
        assert.throws(() => new valueObject('test'));
    });

    it('holds true for post parsed properties', function(assert) {
        var valueObject = self.define('ValueObject', {
            validate: () => true,
            postParsers: {
                property: () => 'added'
            }
        });
        var object = new valueObject('test');
        assert.throws(() => object.property = 'changed');
    });

    it('still allows post parsed properties to be modified by other post parsers', function(assert) {
        var valueObject = self.define('ValueObject', {
            validate: () => true,
            postParsers: {
                property: () => 'added',
                anotherProperty: (valueObject) => valueObject.property = 'changed'
            }
        });
        var object = new valueObject('test');
        assert.ok(object.property === 'changed');
    });
});
