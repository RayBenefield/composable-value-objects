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
});
