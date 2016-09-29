var describe = require('tape-bdd');
var self = require('../src/valueObject');

describe('ValueObject parsing', function(it) {
    it('allows defining of new properties', function(assert) {
        var valueObject = self.define('ValueObject', {
            validate: () => true,
            preParsers: {
                parsed: (valueObject) => valueObject.value.split('.')[1],
            }
        });
        var object = new valueObject('test.parsed');
        assert.ok(object.parsed.valueOf() === 'parsed');
    });
});
