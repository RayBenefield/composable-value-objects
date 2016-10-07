import describe from 'tape-bdd';
import Self from 'src/value-object';

describe('ValueObject parsing', (it) => {
    it('maintains an original immutable value', (assert) => {
        const ValueObject = Self.define('ValueObject', {
            validate: () => true,
            preParsers: {
                original: () => 'parsed',
                value: () => 'parsed',
            },
        });
        const object = new ValueObject('roar roar roar');
        assert.ok(object.original.valueOf() === 'roar roar roar');
        Self.clearDatabase();
    });

    it('allows defining of new properties', (assert) => {
        const ValueObject = Self.define('ValueObject', {
            validate: () => true,
            preParsers: {
                parsed: valueObject => valueObject.value.split('.')[1],
            },
        });
        const object = new ValueObject('test.parsed');
        assert.ok(object.parsed.valueOf() === 'parsed');
        Self.clearDatabase();
    });

    it('allows defining of new properties with non-functions', (assert) => {
        const ValueObject = Self.define('ValueObject', {
            validate: () => true,
            preParsers: {
                parsed: 'parsed',
            },
        });
        const object = new ValueObject('test');
        assert.ok(object.parsed.valueOf() === 'parsed');
        Self.clearDatabase();
    });

    it('allows defining of new nested properties', (assert) => {
        const ValueObject = Self.define('ValueObject', {
            validate: () => true,
            preParsers: {
                'parsed.nested': valueObject => valueObject.value.split('.')[1],
            },
        });
        const object = new ValueObject('test.parsed');
        assert.ok(object.parsed.nested.valueOf() === 'parsed');
        Self.clearDatabase();
    });

    it('allows defining of new deeply nested properties', (assert) => {
        const ValueObject = Self.define('ValueObject', {
            validate: () => true,
            preParsers: {
                'parsed.nested.again.and.again': valueObject => valueObject.value.split('.')[1],
            },
        });
        const object = new ValueObject('test.parsed');
        assert.ok(object.parsed.nested.again.and.again.valueOf() === 'parsed');
        Self.clearDatabase();
    });

    it('allows adding properties to the value', (assert) => {
        const ValueObject = Self.define('ValueObject', {
            validate: () => true,
            preParsers: {
                value(valueObject) {
                    return {
                        property1: valueObject.value.split('.')[0],
                        property2: valueObject.value.split('.')[1],
                    };
                },
            },
        });
        const object = new ValueObject('first.second');
        assert.ok(
            object.valueOf().property1 === 'first'
            && object.valueOf().property2 === 'second'
            && object.property1 === 'first'
            && object.property2 === 'second'
        );
        Self.clearDatabase();
    });

    it('allows changing the object value from another parser as a string', (assert) => {
        const ValueObject = Self.define('ValueObject', {
            validate: () => true,
            preParsers: {
                parsed: valueObject => valueObject.value = 'changed',
            },
        });
        const object = new ValueObject('testing');
        assert.ok(
            object.valueOf() === 'changed'
            && object.value === 'changed'
            && object.parsed === 'changed'
            && object.valueOf().parsed !== 'changed'
        );
        Self.clearDatabase();
    });

    it('allows adding properties to the object value from another parser', (assert) => {
        const ValueObject = Self.define('ValueObject', {
            validate: () => true,
            preParsers: {
                parsed: valueObject => valueObject.value.newProperty = 'added',
            },
        });
        const object = new ValueObject({ property: 'original' });
        assert.ok(
            object.valueOf().property === 'original'
            && object.value.property === 'original'
            && object.valueOf().newProperty === 'added'
            && object.value.newProperty === 'added'
            && object.parsed === 'added'
            && !('parsed' in object.value)
        );
        Self.clearDatabase();
    });

    it('allows adding cached properties to the object after validation', (assert) => {
        const ValueObject = Self.define('ValueObject', {
            validate: () => true,
            postParsers: {
                parsed: () => 'post',
            },
        });
        const object = new ValueObject('testing');
        assert.ok(object.parsed === 'post');
        Self.clearDatabase();
    });
});
