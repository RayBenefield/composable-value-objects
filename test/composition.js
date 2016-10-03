var describe = require('tape-bdd');
var self = require('src/value-object');

describe('ValueObject composition', function(it) {
    it('passes parsed values to the respective composite object', function(assert) {
        var composite = self.define('Composite', {
            validate: (object) => object.value === 'test'
        });

        var valueObject = self.define('Value Object', {
            validate: () => true,
            composites: {
                "composite": composite
            },
            preParsers: {
                "composite": (object) => object.value.split('.')[1]
            }
        });

        var result = new valueObject('composite.test');
        assert.ok(result.composite.valueOf() === 'test');
    });
});
