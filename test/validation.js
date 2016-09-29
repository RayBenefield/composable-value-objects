var describe = require('tape-bdd');
var self = require('../src/valueObject');

describe('ValueObject validation', function(it) {
    it('throws an exception if validate returns false', function(assert) {
        var valueObject = self.define('ValueObject', { validate: () => false });
        assert.throws(() => new valueObject());
    });
});
