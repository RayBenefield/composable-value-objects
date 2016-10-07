import describe from 'tape-bdd';
import Self from 'src/value-object';

describe('ValueObject stringification', (it) => {
    it('returns a stringified value', (assert) => {
        const ValueObject = Self.define('ValueObject', { validate: () => true });
        const object = new ValueObject('test');
        assert.ok(object.toString() === '"test"');
        Self.clearDatabase();
    });

    it('returns a stringified object', (assert) => {
        const ValueObject = Self.define('ValueObject', { validate: () => true });
        const object = new ValueObject({ test: 'string' });
        assert.ok(object.toString() === '{"test":"string"}');
        Self.clearDatabase();
    });

    it('returns a stringified object with a parsed value', (assert) => {
        const ValueObject = Self.define('ValueObject', {
            validate: () => true,
            preParsers: {
                value(object) {
                    return { test: object.original };
                },
            },
        });
        const object = new ValueObject('roar');
        assert.ok(object.toString() === '{"test":"roar"}');
        Self.clearDatabase();
    });

    it('returns a stringified object with a composite object', (assert) => {
        const composite = Self.define('Composite', {
            validate: object => object.value === 'test',
        });
        const ValueObject = Self.define('Value Object', {
            validate: () => true,
            composites: {
                composite,
            },
            preParsers: {
                composite: object => object.value.split('.')[1],
            },
        });
        const result = new ValueObject('composite.test');
        assert.ok(result.toString() === '{"composite":"test"}');
        Self.clearDatabase();
    });

    it('returns a stringified object with multiple composite objects', (assert) => {
        const composite1 = Self.define('Composite #1', {
            validate: object => object.value === 'test1',
        });
        const composite2 = Self.define('Composite #2', {
            validate: object => object.value === 'test2',
        });
        const ValueObject = Self.define('Value Object', {
            validate: () => true,
            composites: {
                compositeOne: composite1,
                compositeTwo: composite2,
            },
            preParsers: {
                compositeOne: object => object.value.split('.')[0],
                compositeTwo: object => object.value.split('.')[1],
            },
        });
        const result = new ValueObject('test1.test2');
        assert.ok(result.toString() === '{"compositeOne":"test1","compositeTwo":"test2"}');
        Self.clearDatabase();
    });

    it('returns a stringified object with multiple composite objects using an obect as a value', (assert) => {
        const composite1 = Self.define('Composite #1', {
            validate: object => object.value === 'test1',
        });
        const composite2 = Self.define('Composite #2', {
            validate: object => object.value === 'test2',
        });
        const ValueObject = Self.define('Value Object', {
            validate: () => true,
            composites: {
                compositeOne: composite1,
                compositeTwo: composite2,
            },
            preParsers: {
                compositeOne: object => object.value.property.split('.')[0],
                compositeTwo: object => object.value.property.split('.')[1],
            },
        });
        const result = new ValueObject({ property: 'test1.test2' });
        assert.ok(result.toString() === '{"property":"test1.test2","compositeOne":"test1","compositeTwo":"test2"}');
        Self.clearDatabase();
    });

    it('returns a stringified object with nested composite objects', (assert) => {
        const compositeDeep = Self.define('Composite Deep', {
            validate: object => object.original === 'test2',
        });
        const compositeShallow = Self.define('Composite Shallow', {
            validate: () => true,
            composites: {
                composite: compositeDeep,
            },
            preParsers: {
                composite: object => object.original.split(';')[1],
            },
        });
        const ValueObject = Self.define('Value Object', {
            validate: () => true,
            composites: {
                deep: compositeShallow,
            },
            preParsers: {
                deep: object => object.original.split('.')[1],
            },
        });
        const result = new ValueObject('first.test1;test2');
        assert.ok(result.toString() === '{"deep":{"composite":"test2"}}');
        Self.clearDatabase();
    });
});
