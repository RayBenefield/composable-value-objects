import describe from 'tape-bdd';
import Self from 'src/value-object';

describe('ValueObject equality', (it) => {
    it('ensures two objects created with the same value are the truly equal', (assert) => {
        const ValueObject = Self.define('Value Object', { validate: () => true });
        const object1 = new ValueObject('test');
        const object2 = new ValueObject('test');
        assert.ok(object1 === object2);
        Self.clearDatabase();
    });

    it('ensures two objects created with the same object value are truly equal', (assert) => {
        const ValueObject = Self.define('Value Object', { validate: () => true });
        const object1 = new ValueObject({ test: 'test' });
        const object2 = new ValueObject({ test: 'test' });
        assert.ok(object1 === object2);
        Self.clearDatabase();
    });

    it('ensures the nested values of objects are truly equal', (assert) => {
        const ValueObject = Self.define('Value Object', { validate: () => true });
        const object1 = new ValueObject({ test: 'test' });
        const object2 = new ValueObject({ test: 'test' });
        assert.ok(object1.test === object2.test);
        Self.clearDatabase();
    });

    it('ensures the nested object values of objects are truly equal', (assert) => {
        const ValueObject = Self.define('Value Object', { validate: () => true });
        const object1 = new ValueObject({ test: { again: 'test' } });
        const object2 = new ValueObject({ test: { again: 'test' } });
        assert.ok(object1.test.again === object2.test.again);
        Self.clearDatabase();
    });

    it('ensures the values of keys are equal despite different original values', (assert) => {
        const ValueObject = Self.define('Value Object', { validate: () => true });
        const object1 = new ValueObject({ test: { again: 'test' } });
        const object2 = new ValueObject({ again: 'test' });
        assert.ok(object1.test.again === object2.again);
        Self.clearDatabase();
    });

    it('ensures the object values parsed out are truly equal', (assert) => {
        const ValueObject = Self.define('Value Object', {
            validate: () => true,
            preParsers: {
                parsed: { objectProperty: 'value' },
            },
        });
        const ValueObject2 = Self.define('Value Object 2', {
            validate: () => true,
            preParsers: {
                parsed: { objectProperty: 'value' },
            },
        });
        const object1 = new ValueObject('test');
        const object2 = new ValueObject2('roar');
        assert.ok(object1.parsed === object2.parsed);
        Self.clearDatabase();
    });

    it('ensures the object values of keys are equal despite different original values', (assert) => {
        const ValueObject = Self.define('Value Object', { validate: () => true });
        const object1 = new ValueObject({ test: { again: { and: 'test' } } });
        const object2 = new ValueObject({ again: { and: 'test' } });
        assert.ok(object1.test.again === object2.again);
        Self.clearDatabase();
    });
});
