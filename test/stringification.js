var describe = require('tape-bdd');
var self = require('src/value-object');

describe('ValueObject stringification', function(it) {
    it('returns an stringified object', function(assert) {
        var valueObject = self.define('ValueObject', { validate: () => true });
        var object = new valueObject({ test: 'string' });
        assert.ok(object.toString() === '{"test":"string"}');
    });
});
