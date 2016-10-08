import describe from 'tape-bdd';
import Self from 'src/value-object';

describe('ValueObject equality', (it) => {
    it('two objects created with the same value are the truly equal', (assert) => {
        const ValueObject = Self.define('Value Object', { validate: () => true });
        const object1 = new ValueObject('test');
        const object2 = new ValueObject('test');
        assert.ok(object1 === object2);
        Self.clearDatabase();
    });

    it('two objects created with the same object value are truly equal', (assert) => {
        const ValueObject = Self.define('Value Object', { validate: () => true });
        const object1 = new ValueObject({ test: 'test' });
        const object2 = new ValueObject({ test: 'test' });
        assert.ok(object1 === object2);
        Self.clearDatabase();
    });

    it('the nested values of objects are truly equal', (assert) => {
        const ValueObject = Self.define('Value Object', { validate: () => true });
        const object1 = new ValueObject({ test: 'test' });
        const object2 = new ValueObject({ test: 'test' });
        assert.ok(object1.test === object2.test);
        Self.clearDatabase();
    });
});
