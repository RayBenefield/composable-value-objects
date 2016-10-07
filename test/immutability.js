import describe from 'tape-bdd';
import Self from 'src/value-object';

describe('ValueObject immutability', (it) => {
    it('holds true for a primitive', (assert) => {
        const ValueObject = Self.define('ValueObject', { validate: () => true });
        const object = new ValueObject('test');
        assert.throws(() => object.value = 'roar');
        Self.clearDatabase();
    });

    it('holds true for an object', (assert) => {
        const ValueObject = Self.define('ValueObject', { validate: () => true });
        const object = new ValueObject({ key: 'value' });
        assert.throws(() => object.key = 'roar');
        Self.clearDatabase();
    });

    it('holds true for a nested object', (assert) => {
        const ValueObject = Self.define('ValueObject', { validate: () => true });
        const object = new ValueObject({ key: { secondKey: 'value' } });
        assert.throws(() => object.key.secondKey = 'roar');
        Self.clearDatabase();
    });

    it('holds true for a deeply nested object', (assert) => {
        const ValueObject = Self.define('ValueObject', { validate: () => true });
        const object = new ValueObject({
            key1: {
                key2: {
                    key3: {
                        key4: {
                            key5: 'value',
                        },
                    },
                },
            },
        });
        assert.throws(() => object.key1.key2.key3.key4.key5 = 'roar');
        Self.clearDatabase();
    });

    it('holds true for a parsed properties', (assert) => {
        const ValueObject = Self.define('ValueObject', {
            validate: () => true,
            preParsers: {
                parsed: () => 'test',
            },
        });
        const object = new ValueObject();
        assert.throws(() => object.parsed = 'roar');
        Self.clearDatabase();
    });

    it('holds true for a nested parsed properties', (assert) => {
        const ValueObject = Self.define('ValueObject', {
            validate: () => true,
            preParsers: {
                'parsed.nested': valueObject => valueObject.value.split('.')[1],
            },
        });
        const object = new ValueObject('test.parsed');
        assert.throws(() => object.parsed.nested = 'roar');
        Self.clearDatabase();
    });

    it('holds true for deeply nested parsed properties', (assert) => {
        const ValueObject = Self.define('ValueObject', {
            validate: () => true,
            preParsers: {
                'parsed.nested.again.and.again': valueObject => valueObject.value.split('.')[1],
            },
        });
        const object = new ValueObject('test.parsed');
        assert.throws(() => object.parsed.nested.again.and.again = 'roar');
        Self.clearDatabase();
    });

    it('stops post parsers from editing the value', (assert) => {
        const ValueObject = Self.define('ValueObject', {
            validate: () => true,
            postParsers: {
                value: () => 'changed',
            },
        });
        const object = new ValueObject('test');
        assert.ok(object.value !== 'changed');
        Self.clearDatabase();
    });

    it('stops post parsers from editing properties from pre parsers', (assert) => {
        const ValueObject = Self.define('ValueObject', {
            validate: () => true,
            preParsers: {
                property: () => 'added',
            },
            postParsers: {
                anotherProperty: valueObject => valueObject.property = 'changed',
            },
        });
        assert.throws(() => new ValueObject('test'));
        Self.clearDatabase();
    });

    it('holds true for post parsed properties', (assert) => {
        const ValueObject = Self.define('ValueObject', {
            validate: () => true,
            postParsers: {
                property: () => 'added',
            },
        });
        const object = new ValueObject('test');
        assert.throws(() => object.property = 'changed');
        Self.clearDatabase();
    });

    it('still allows post parsed properties to be modified by other post parsers', (assert) => {
        const ValueObject = Self.define('ValueObject', {
            validate: () => true,
            postParsers: {
                property: () => 'added',
                anotherProperty: valueObject => valueObject.property = 'changed',
            },
        });
        const object = new ValueObject('test');
        assert.ok(object.property === 'changed');
        Self.clearDatabase();
    });
});
