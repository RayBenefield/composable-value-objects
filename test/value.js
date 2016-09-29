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
});
