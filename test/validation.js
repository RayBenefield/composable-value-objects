import describe from 'tape-bdd';
import Self from 'src/value-object';

describe('ValueObject validation', (it) => {
    it('throws an exception if there is no value', (assert) => {
        const ValueObject = Self.define('ValueObject', { validate: () => true });
        assert.throws(() => new ValueObject());
        Self.clearDatabase();
    });

    it('throws an exception if validate returns false', (assert) => {
        const ValueObject = Self.define('ValueObject', { validate: () => false });
        assert.throws(() => new ValueObject('test'));
        Self.clearDatabase();
    });

    it('sets the value if the value is valid', (assert) => {
        const ValueObject = Self.define('ValueObject', { validate: () => true });
        const object = new ValueObject('test');
        assert.ok(object.valueOf() === 'test');
        Self.clearDatabase();
    });

    it('allows the defined ValueObject to be used for validation', (assert) => {
        const ValueObject = Self.define('ValueObject', { validate: () => true });
        assert.ok(ValueObject.validate('test'));
        Self.clearDatabase();
    });

    it('allows pre-parsed values to be used for validation', (assert) => {
        const ValueObject = Self.define('ValueObject', {
            validate: valueObject => valueObject.parsed !== 'parsed',
            preParsers: {
                parsed: valueObject => valueObject.value.split('.')[1],
            },
        });
        assert.throws(() => new ValueObject('test.parsed'));
        Self.clearDatabase();
    });

    it('allows nested composite objects the ability to invalidate the whole object', (assert) => {
        const compositeDeep = Self.define('Composite Deep', {
            validate: () => false,
        });
        const compositeShallow = Self.define('Composite Shallow', {
            validate: () => true,
            composites: {
                composite: compositeDeep,
            },
            preParsers: {
                composite: 'test',
            },
        });
        const ValueObject = Self.define('Value Object', {
            validate: () => true,
            composites: {
                composite: compositeShallow,
            },
            preParsers: {
                composite: 'test',
            },
        });
        assert.throws(() => new ValueObject('test'));
        Self.clearDatabase();
    });

    it('allows pre-parsed values to be used for validation in the defined ValueObject', (assert) => {
        const ValueObject = Self.define('ValueObject', {
            validate: valueObject => valueObject.parsed === 'parsed',
            preParsers: {
                parsed: valueObject => valueObject.value.split('.')[1],
            },
        });
        assert.ok(ValueObject.validate('test.parsed'));
        Self.clearDatabase();
    });
});
