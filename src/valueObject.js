var ValueObject = function(value) {
    // Create an immutable original value
    createImmutableProperty(this, 'original', value);

    // Set the initial value in case it doesn't change
    this.value = value;

    // If PreParsers exist then use them to create new properties
    if (this.preParsers) {
        for (var preProperty in this.preParsers) {
            addNestedProperty(this, preProperty, this.preParsers[preProperty]);
        }
    }

    // Validate value to see if we should continue
    if ( ! this.validate(this)) { throw new Error('Not a valid value'); }

    // Every top level of value should be a property of this
    for (var property in this.value) {
        this[property] = this.value[property];
    }

    // Make this entire object immutable
    makeImmutable(this);

    // If PostParsers exist then use them to create new properties
    if (this.postParsers) {
        for (var postProperty in this.postParsers) {
            addNestedProperty(this, postProperty, this.postParsers[postProperty]);
        }
    }

    // Lock down the new properties that were added from postParsers
    makeImmutable(this);

    return this;
};

ValueObject.define = function(name, definition) {
    if ( ! name) { throw Error('Value objects require a name.'); }
    if ( ! definition) { throw Error('Value objects require a definition.'); }
    if ( ! definition.validate) { throw Error('Value object definitions require validation.'); }
    if ( typeof definition.validate !== 'function') { throw Error('The validate property must be a function.'); }

    // Prepare an object for instantion
    var object = function(value) {
        ValueObject.call(this, value);
    };

    // Make the object be of type ValueObject
    object.prototype = Object.create(ValueObject.prototype);

    // Allow for overwriting of ValueObject properties using the definition
    for (var property in definition) {
        object.prototype[property] = definition[property];
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
};

ValueObject.prototype.valueOf = function() {
    return this.value;
};

ValueObject.prototype.toString = function() {
    return JSON.stringify(this.value);
};

var createImmutableProperty = function(object, property, value) {
    Object.defineProperty(object, property, {
        value: value,
        writable: false
    });
};

var makeImmutable = function makeImmutable(value) {
    // Each property needs to be made immutable
    for(var property in value) {
        // If property is also an object then be recursive
        if (value[property] instanceof Object) {
            value[property] = makeImmutable(value[property]);
        }

        createImmutableProperty(value, property, value[property]);
    }

    return value;
};

// Parse a nested property in the form of 'prop.prop.prop' and add it to the object
var addNestedProperty = function(object, property, parser) {
    var properties = property.split('.');
    var focus = object;

    // For each property level we need to go deeper
    for(var i = 0; i < properties.length; i++) {
        // When we get to the last property it gets parsed
        if (i == properties.length - 1) {
            focus[properties[i]] = parser(object);
            break;
        }

        // We aren't on the last so create a new object for the next property
        focus = focus[properties[i]] = {};
    }
};

module.exports = ValueObject;
