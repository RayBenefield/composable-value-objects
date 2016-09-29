var describe = require('tape-bdd');
var self = require('../src/valueObject');

describe('ValueObject value', function(it) {
    it('cannot be changed as a primitive', function(assert) {
        var valueObject = self.define('ValueObject', { validate: () => true });
        var object = new valueObject('test');
        object.value = 'roar';
        assert.ok(object.valueOf() === 'test');
    });

    it('cannot be changed as an object', function(assert) {
        var valueObject = self.define('ValueObject', { validate: () => true });
        var object = new valueObject({ key: 'value' });
        object.key = 'roar';
        assert.ok(object.key.valueOf() === 'value');
    });

    it('cannot be changed as a nested object', function(assert) {
        var valueObject = self.define('ValueObject', { validate: () => true });
        var object = new valueObject({ key: { secondKey: 'value' } });
        object.key.secondKey = 'roar';
        assert.ok(object.key.secondKey.valueOf() === 'value');
    });

    it('cannot be changed as a deeply nested object', function(assert) {
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
