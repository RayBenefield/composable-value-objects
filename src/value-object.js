import _ from 'underscore';
import freezer from './deep-freezer';
import createImmutableProperty from './create-immutable-property';
import makeImmutable from './make-immutable';
import getRawValue from './get-raw-value';
import applyParsers from './apply-parsers';
import composeObject from './compose-object';

const ValueObject = function ValueObject(value) {
    if (!value) { throw new Error('There is no value to use.'); }

    // Create an immutable original value
    this.original = freezer.retrieve(value);
    if (!this.original) {
        this.original = freezer.store(value);
    }
    createImmutableProperty(this, 'original', value);

    const testObject = composeObject(
        value,
        this.preParsers,
        this.composites
    );
    _.extend(this, testObject);

    // Validate value to see if we should continue
    if (!this.validate(this)) { throw new Error('Not a valid value'); }

    // If value is an Object, every top level of value should be a property of this
    if (this.value instanceof Object) {
        Object.entries(this.value).forEach(([property, propertyValue]) => {
            this[property] = propertyValue;
        });
    }

    // First store everything in this object that isn't stored yet
    freezer.massStore(this);

    // Then find everything in storage that can be replaced and do it
    const inStorage = freezer.inStorage(this);
    _.extend(this, inStorage);

    makeImmutable(this);

    // If PostParsers exist then use them to create new properties
    if (this.postParsers) {
        const postParsedValues = applyParsers(this, this.postParsers);
        _.extend(this, postParsedValues);
    }

    // Lock down the new properties that were added from postParsers
    makeImmutable(this);

    return this;
};

ValueObject.define = function define(name, definition) {
    if (!name) { throw Error('Value objects require a name.'); }
    if (!definition) { throw Error('Value objects require a definition.'); }
    if (!definition.validate) { throw Error('Value object definitions require validation.'); }
    if (typeof definition.validate !== 'function') { throw Error('The validate property must be a function.'); }

    // Prepare an object for instantion
    const NewValueObject = function NewValueObject(value) {
        ValueObject.call(this, value);
    };

    // Make the NewValueObject be of type ValueObject
    NewValueObject.prototype = Object.create(ValueObject.prototype);

    // Allow for overwriting of ValueObject properties using the definition
    Object.entries(definition).forEach(([property, value]) => {
        NewValueObject.prototype[property] = value;
    });

    // Create the defined constructor
    const constructor = function constructor(value) {
        let obj = freezer.retrieve(value, NewValueObject);
        if (!obj) {
            obj = freezer.store(value, NewValueObject);
        }
        return obj;
    };

    // Make sure objects made with the constructor keep their `instanceof` type
    constructor.prototype = NewValueObject.prototype;

    // Enable validation through the defined type
    constructor.validate = function validate(testValue) {
        const testObject = composeObject(
            testValue,
            definition.preParsers,
            definition.composites
        );

        return NewValueObject.prototype.validate(testObject);
    };

    // Return the constructor to create the object
    return constructor;
};

ValueObject.prototype.valueOf = function valueOf() {
    return getRawValue(this.value.valueOf());
};

ValueObject.prototype.toString = function toString() {
    return JSON.stringify(this.valueOf());
};

ValueObject.clearDatabase = function clearDatabase() {
    freezer.clear();
};

module.exports = ValueObject;
