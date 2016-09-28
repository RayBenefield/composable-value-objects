var describe = require('tape-bdd');
var self = require('../src/valueObject');

describe('valueObject-definition', function(it) {
    it('throws an exception if it has no name', function(assert) {
        assert.throws(() => self.define());
    });

    it('throws an exception if it has no definition', function(assert) {
        assert.throws(() => self.define('ValueObject'));
    });
});
