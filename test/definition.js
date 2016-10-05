import describe from 'tape-bdd';
import Self from 'src/value-object';

describe('ValueObject definition', (it) => {
    it('throws an exception if it has no name', (assert) => {
        assert.throws(() => Self.define());
    });

    it('throws an exception if it has no definition', (assert) => {
        assert.throws(() => Self.define('ValueObject'));
    });

    it('throws an exception if validate is missing', (assert) => {
        assert.throws(() => Self.define('ValueObject', {}));
    });

    it('throws an exception if validate is not a function', (assert) => {
        assert.throws(() => Self.define('ValueObject', { validate: true }));
    });

    it('returns a constructor', (assert) => {
        const ValueObject = Self.define('ValueObject', { validate: () => true });
        assert.ok(new ValueObject());
    });

    it('constructor returns an object of type ValueObject', (assert) => {
        const ValueObject = Self.define('ValueObject', { validate: () => true });
        const object = new ValueObject();
        assert.ok(object instanceof Self);
    });

    it('constructor returns an object of the created type', (assert) => {
        const CustomValueObject = Self.define('ValueObject', { validate: () => true });
        const object = new CustomValueObject();
        assert.ok(object instanceof CustomValueObject);
    });

    it('constructor returns an object with the definition properties', (assert) => {
        const ValueObject = Self.define('ValueObject', { validate: () => true });
        const object = new ValueObject();
        assert.ok(object.validate());
    });
});
