var describe = require('tape-bdd');
var self = require('../src/valueObject');

describe('ValueObject immutability', function(it) {
    it('holds true for a primitive', function(assert) {
        var valueObject = self.define('ValueObject', { validate: () => true });
        var object = new valueObject('test');
        object.value = 'roar';
        assert.ok(object.valueOf() === 'test');
    });

    it('holds true for an object', function(assert) {
        var valueObject = self.define('ValueObject', { validate: () => true });
        var object = new valueObject({ key: 'value' });
        object.key = 'roar';
        assert.ok(object.key.valueOf() === 'value');
    });

    it('holds true for a nested object', function(assert) {
        var valueObject = self.define('ValueObject', { validate: () => true });
        var object = new valueObject({ key: { secondKey: 'value' } });
        object.key.secondKey = 'roar';
        assert.ok(object.key.secondKey.valueOf() === 'value');
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
        object.key1.key2.key3.key4.key5 = 'roar';
        assert.ok(object.key1.key2.key3.key4.key5.valueOf() === 'value');
    });

    it('holds true for a parsed properties', function(assert) {
        var valueObject = self.define('ValueObject', {
            validate: () => true,
            preParsers: {
                parsed: () => 'test'
            }
        });
        var object = new valueObject();
        object.parsed = 'roar';
        assert.ok(object.parsed.valueOf() === 'test');
    });

    it('holds true for a nested parsed properties', function(assert) {
        var valueObject = self.define('ValueObject', {
            validate: () => true,
            preParsers: {
                'parsed.nested': (valueObject) => valueObject.value.split('.')[1],
            }
        });
        var object = new valueObject('test.parsed');
        object.parsed.nested = 'roar';
        assert.ok(object.parsed.nested.valueOf() === 'parsed');
    });

    it('holds true for deeply nested parsed properties', function(assert) {
        var valueObject = self.define('ValueObject', {
            validate: () => true,
            preParsers: {
                'parsed.nested.again.and.again': (valueObject) => valueObject.value.split('.')[1],
            }
        });
        var object = new valueObject('test.parsed');
        object.parsed.nested.again.and.again = 'roar';
        assert.ok(object.parsed.nested.again.and.again.valueOf() === 'parsed');
    });
});