// The in-memory database for flyweight objects
const freezer = (function freezer() {
    let db = Object.create(null);
    return {
        retrieve(value, Type) {
            // Store objects by type in "tables"
            let table = db[Type.name];

            // If there is no table then we'll create it
            if (!table) {
                table = db[Type.name] = Object.create(null);
            }

            // We need to store the value objects based on its value. In that way we can
            // easily search if it already exists. Because the value might be anything
            // and we can use strings as a key we need to encode it to JSON.
            const key = JSON.stringify(value);

            // If it already exists then we'll re-use it
            if (table[key]) return table[key];

            // Otherwise let's store the new object
            table[key] = new Type(value);

            // And return it
            return table[key];
        },
        clear() {
            db = Object.create(null);
        },
    };
}());

const createImmutableProperty = function createImmutable(object, property, value) {
    Object.defineProperty(object, property, {
        value,
        writable: false,
    });
};

const isWritable = function isWritable(object, property) {
    const propertyDescriptor = Object.getOwnPropertyDescriptor(object, property);
    return !propertyDescriptor
        || (propertyDescriptor.writable && propertyDescriptor.writable === true);
};

// Parse a nested property in the form of 'prop.prop.prop' and add it to the object
const addNestedProperty = function addNestedProperty(object, property, parser) {
    const properties = property.split('.');
    let focus = object;

    // For each property level we need to go deeper
    properties.some((nestedProperty, index) => {
        // When we get to the last nestedProperty it gets parsed
        if (index === properties.length - 1) {
            if (isWritable(focus, nestedProperty)) {
                if (typeof parser === 'function') {
                    focus[nestedProperty] = parser(object);
                    return true;
                }

                focus[nestedProperty] = parser;
            }
            return true;
        }

        // We aren't on the last so create a new object for the next nestedProperty
        if (isWritable(focus, nestedProperty)) {
            focus = focus[nestedProperty] = {};
        }
        return false;
    });
};

const makeImmutable = function makeImmutable(value) {
    // Each property needs to be made immutable
    Object.entries(value).forEach(([property, propertyValue]) => {
        // If property is also an object then be recursive
        if (propertyValue instanceof Object) {
            if (isWritable(value, property)) {
                makeImmutable(propertyValue);
            }
        }

        createImmutableProperty(value, property, value[property]);
    });

    return value;
};

const getRawValue = function getRawValue(value) {
    let rawValue = value;
    if (value instanceof Object) {
        rawValue = {};
        Object.entries(value).forEach(([property, propertyValue]) => {
            rawValue[property] = getRawValue(propertyValue.valueOf());
        });
    }
    return rawValue;
};

const ValueObject = function ValueObject(value) {
    if (!value) { throw new Error('There is no value to use.'); }

    // Create an immutable original value
    createImmutableProperty(this, 'original', value);

    // Set the initial value in case it doesn't change
    this.value = value;

    // If PreParsers exist then use them to create new properties
    if (this.preParsers) {
        Object.entries(this.preParsers).forEach(([preProperty, preParser]) => {
            addNestedProperty(this, preProperty, preParser);
        });
    }

    // If composites exist then use pre-parsed values to create them
    if (this.composites) {
        if (!(this.value instanceof Object)) {
            this.value = {};
        }

        Object.entries(this.composites).forEach(([composite, compositeType]) => {
            const Type = compositeType;
            this.value[composite] = freezer.retrieve(this[composite], Type);
        });
    }

    // Validate value to see if we should continue
    if (!this.validate(this)) { throw new Error('Not a valid value'); }

    // If value is an Object, every top level of value should be a property of this
    if (this.value instanceof Object) {
        Object.entries(this.value).forEach(([property, propertyValue]) => {
            this[property] = propertyValue;
        });
    }

    // Make this entire object immutable
    makeImmutable(this);

    // If PostParsers exist then use them to create new properties
    if (this.postParsers) {
        Object.entries(this.postParsers).forEach(([postProperty, postParser]) => {
            addNestedProperty(this, postProperty, postParser);
        });
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
        return freezer.retrieve(value, NewValueObject);
    };

    // Make sure objects made with the constructor keep their `instanceof` type
    constructor.prototype = NewValueObject.prototype;

    // Enable validation through the defined type
    constructor.validate = NewValueObject.prototype.validate;

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
