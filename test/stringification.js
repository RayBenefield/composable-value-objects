var describe = require('tape-bdd');
var self = require('src/value-object');

describe('ValueObject stringification', function(it) {
    it('returns an stringified value', function(assert) {
        var valueObject = self.define('ValueObject', { validate: () => true });
        var object = new valueObject('test');
        assert.ok(object.toString() === '"test"');
    });

    it('returns an stringified object', function(assert) {
        var valueObject = self.define('ValueObject', { validate: () => true });
        var object = new valueObject({ test: 'string' });
        assert.ok(object.toString() === '{"test":"string"}');
    });

    it('returns an stringified object with a parsed value', function(assert) {
        var valueObject = self.define('ValueObject', {
            validate: () => true,
            preParsers: {
                value: (object) => { return { test: object.original }; }
            }
        });
        var object = new valueObject('roar');
        assert.ok(object.toString() === '{"test":"roar"}');
    });
});
