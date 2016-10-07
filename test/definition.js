import describe from 'tape-bdd';
import Self from 'src/value-object';

describe('ValueObject definition', (it) => {
    it('throws an exception if it has no name', (assert) => {
        assert.throws(() => Self.define());
        Self.clearDatabase();
    });

    it('throws an exception if it has no definition', (assert) => {
        assert.throws(() => Self.define('ValueObject'));
        Self.clearDatabase();
    });

    it('throws an exception if validate is missing', (assert) => {
        assert.throws(() => Self.define('ValueObject', {}));
        Self.clearDatabase();
    });

    it('throws an exception if validate is not a function', (assert) => {
        assert.throws(() => Self.define('ValueObject', { validate: true }));
        Self.clearDatabase();
    });

    it('returns a constructor', (assert) => {
        const ValueObject = Self.define('ValueObject', { validate: () => true });
        assert.ok(new ValueObject('test'));
        Self.clearDatabase();
    });

    it('constructor returns an object of type ValueObject', (assert) => {
        const ValueObject = Self.define('ValueObject', { validate: () => true });
        const object = new ValueObject('test');
        assert.ok(object instanceof Self);
        Self.clearDatabase();
    });

    it('constructor returns an object of the created type', (assert) => {
        const CustomValueObject = Self.define('ValueObject', { validate: () => true });
        const object = new CustomValueObject('test');
        assert.ok(object instanceof CustomValueObject);
        Self.clearDatabase();
    });

    it('constructor returns an object with the definition properties', (assert) => {
        const ValueObject = Self.define('ValueObject', { validate: () => true });
        const object = new ValueObject('test');
        assert.ok(object.validate());
        Self.clearDatabase();
    });
});
