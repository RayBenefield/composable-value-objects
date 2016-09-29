var describe = require('tape-bdd');
var self = require('../src/valueObject');

describe('ValueObject validation', function(it) {
    it('throws an exception if validate returns false', function(assert) {
        var valueObject = self.define('ValueObject', { validate: () => false });
        assert.throws(() => new valueObject());
    });

    it('sets the value if the value is valid', function(assert) {
        var valueObject = self.define('ValueObject', { validate: () => true });
        var object = new valueObject('test');
        assert.ok(object.valueOf() === 'test');
    });

    it('allows the defined ValueObject to be used for validation', function(assert) {
        var valueObject = self.define('ValueObject', { validate: () => true });
        assert.ok(valueObject.validate('test'));
    });

    it('allows pre-parsed values to be used for validation', function(assert) {
        var valueObject = self.define('ValueObject', {
            validate: () => (this.parsed != 'parsed'),
            preParsers: {
                parsed: (value) => this.value.split('.')[1],
            }
        });
        assert.ok(new valueObject('test.parsed'));
    });
});
