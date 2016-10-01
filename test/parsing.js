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

    it('allows changing the object value from another parser as a string', function(assert) {
        var valueObject = self.define('ValueObject', {
            validate: () => true,
            preParsers: {
                parsed: (valueObject) => valueObject.value = 'changed'
            }
        });
        var object = new valueObject('testing');
        assert.ok(
            object.valueOf() === 'changed'
            && object.value === 'changed'
            && object.parsed === 'changed'
            && object.valueOf().parsed !== 'changed'
        );
    });

    it('allows adding properties to the object value from another parser', function(assert) {
        var valueObject = self.define('ValueObject', {
            validate: () => true,
            preParsers: {
                parsed: (valueObject) => valueObject.value.newProperty = 'added'
            }
        });
        var object = new valueObject({ property: 'original' });
        assert.ok(
            object.valueOf().property === 'original'
            && object.value.property === 'original'
            && object.valueOf().newProperty === 'added'
            && object.value.newProperty === 'added'
            && object.parsed === 'added'
            && ! ('parsed' in object.value)
        );
    });

    it('allows adding cached properties to the object after validation', function(assert) {
        var valueObject = self.define('ValueObject', {
            validate: () => true,
            postParsers: {
                parsed: () => 'post'
            }
        });
        var object = new valueObject('testing');
        assert.ok(object.parsed === 'post');
    });
});
