var describe = require('tape-bdd');
var self = require('src/value-object');

describe('ValueObject definition', function(it) {
    it('throws an exception if it has no name', function(assert) {
        assert.throws(() => self.define());
    });

    it('throws an exception if it has no definition', function(assert) {
        assert.throws(() => self.define('ValueObject'));
    });

    it('throws an exception if validate is missing', function(assert) {
        assert.throws(() => self.define('ValueObject', {}));
    });

    it('throws an exception if validate is not a function', function(assert) {
        assert.throws(() => self.define('ValueObject', { validate: true }));
    });

    it('returns a constructor', function(assert) {
        var valueObject = self.define('ValueObject', { validate: () => true });
        assert.ok(new valueObject());
    });

    it('constructor returns an object of type valueObject', function(assert) {
        var valueObject = self.define('ValueObject', { validate: () => true });
        var object = new valueObject();
        assert.ok(object instanceof self);
    });

    it('constructor returns an object of the created type', function(assert) {
        var customValueObject = self.define('ValueObject', { validate: () => true });
        var object = new customValueObject();
        assert.ok(object instanceof customValueObject);
    });

    it('constructor returns an object with the definition properties', function(assert) {
        var valueObject = self.define('ValueObject', { validate: () => true });
        var object = new valueObject();
        assert.ok(object.validate());
    });

    it('constructor returns an object a default toString that is JSON stringified', function(assert) {
        var valueObject = self.define('ValueObject', { validate: () => true });
        var object = new valueObject({ test: 'string' });
        assert.ok(object.toString() === '{"test":"string"}');
    });
});
