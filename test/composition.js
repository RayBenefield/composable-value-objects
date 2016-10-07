import describe from 'tape-bdd';
import Self from 'src/value-object';

describe('ValueObject composition', (it) => {
    it('passes parsed values to the respective composite object', (assert) => {
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
        assert.ok(result.composite.valueOf() === 'test');
        Self.clearDatabase();
    });

    it('passes parsed values to multiple composite objects', (assert) => {
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
        assert.ok(
            result.compositeOne.valueOf() === 'test1'
            && result.compositeTwo.valueOf() === 'test2'
        );
        Self.clearDatabase();
    });

    it('passes parsed values to nested composite objects', (assert) => {
        const compositeDeep = Self.define('Composite Deep', {
            validate: object => object.original === 'test2',
        });
        const compositeShallow = Self.define('Composite Shallow', {
            validate: () => true,
            composites: {
                composite: compositeDeep,
            },
            preParsers: {
                composite: object => object.value.split(';')[1],
            },
        });
        const ValueObject = Self.define('Value Object', {
            validate: () => true,
            composites: {
                deep: compositeShallow,
            },
            preParsers: {
                deep: object => object.value.split('.')[1],
            },
        });
        const result = new ValueObject('first.test1;test2');
        assert.ok(result.deep.composite.valueOf() === 'test2');
        Self.clearDatabase();
    });
});
