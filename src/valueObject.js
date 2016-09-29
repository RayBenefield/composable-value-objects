var ValueObject = function(value) {
    // Validate value to see if we should continue
    if ( ! this.validate(value)) { throw new Error('Not a valid value'); }

    if (value instanceof Object) {
        // Make the entire nested value object immutable
        value = nestedImmutability(value);

        // Every top level of value should be a property of this
        for (property in value) {
            createImmutableProperty(this, property, value[property]);
        }
    }

    createImmutableProperty(this, 'value', value);

    return this;
};

ValueObject.define = function(name, definition) {
    if ( ! name) { throw Error('Value objects require a name.'); }
    if ( ! definition) { throw Error('Value objects require a definition.'); }
    if ( ! definition.validate) { throw Error('Value object definitions require validation.'); }
    if ( ! (typeof definition.validate === 'function')) { throw Error('The validate property must be a function.'); }

    // Prepare an object for instantion
    var object = function(value) {
        ValueObject.call(this, value);
    };

    // Make the object be of type ValueObject
    object.prototype = Object.create(ValueObject.prototype);

    // Allow for overwriting of ValueObject properties using the definition
    for (var prop in definition) {
        object.prototype[prop] = definition[prop];
    }

    // Create the defined constructor
    var constructor = function(value) {
        return new object(value);
    };

    // Make sure objects made with the constructor keep their `instanceof` type
    constructor.prototype = object.prototype;

    // Enable validation through the defined type
    constructor.validate = object.prototype.validate;

    // Return the constructor to create the object
    return constructor;
}

ValueObject.prototype.valueOf = function() {
    return this.value;
}

var createImmutableProperty = function(object, property, value) {
    Object.defineProperty(object, property, {
        value: value,
        writable: false
    });
}

var nestedImmutability = function nestedImmutability(value) {
    // Each property needs to be made immutable
    for(var property in value) {
        // If property is also an object then be recursive
        if (value[property] instanceof Object) {
            value[property] = nestedImmutability(value[property]);
        }

        createImmutableProperty(value, property, value[property]);
    }

    return value;
}

module.exports = ValueObject;
