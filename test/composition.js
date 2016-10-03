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

    it('passes parsed values to multiple composite objects', function(assert) {
        var composite1 = self.define('Composite #1', {
            validate: (object) => object.value === 'test1'
        });

        var composite2 = self.define('Composite #2', {
            validate: (object) => object.value === 'test2'
        });

        var valueObject = self.define('Value Object', {
            validate: () => true,
            composites: {
                "compositeOne": composite1,
                "compositeTwo": composite2,
            },
            preParsers: {
                "compositeOne": (object) => object.value.split('.')[0],
                "compositeTwo": (object) => object.value.split('.')[1]
            }
        });

        var result = new valueObject('test1.test2');
        assert.ok(
            result.compositeOne.valueOf() === 'test1'
            && result.compositeTwo.valueOf() === 'test2'
        );
    });
});
