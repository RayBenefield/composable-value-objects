var describe = require('tape-bdd');
var self = require('../src/valueObject');

describe('ValueObject parsing', function(it) {
    it('maintains an original immutable value', function(assert) {
        var valueObject = self.define('ValueObject', {
            validate: () => true,
            preParsers: {
                original: () => 'parsed',
                value: () => 'parsed',
            }
        });
        var object = new valueObject('roar roar roar');
        assert.ok(object.original.valueOf() == 'roar roar roar');
    });

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

    it('allows defining of new nested properties', function(assert) {
        var valueObject = self.define('ValueObject', {
            validate: () => true,
            preParsers: {
                'parsed.nested': (valueObject) => valueObject.value.split('.')[1],
            }
        });
        var object = new valueObject('test.parsed');
        assert.ok(object.parsed.nested.valueOf() === 'parsed');
    });

    it('allows defining of new deeply nested properties', function(assert) {
        var valueObject = self.define('ValueObject', {
            validate: () => true,
            preParsers: {
                'parsed.nested.again.and.again': (valueObject) => valueObject.value.split('.')[1],
            }
        });
        var object = new valueObject('test.parsed');
        assert.ok(object.parsed.nested.again.and.again.valueOf() === 'parsed');
    });

    it('allows adding properties to the value', function(assert) {
        var valueObject = self.define('ValueObject', {
            validate: () => true,
            preParsers: {
                value: function(valueObject) {
                    return {
                        property1: valueObject.value.split('.')[0],
                        property2: valueObject.value.split('.')[1]
                    }
                }
            }
        });
        var object = new valueObject('first.second');
        assert.ok(
            object.valueOf().property1 === 'first'
            && object.valueOf().property2 === 'second'
            && object.property1 === 'first'
            && object.property2 === 'second'
        );
    });
});
