var ValueObject = function(value) {
    return {};
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

    // Return the constructor to create the object
    return function(value) {
        return new object(value);
    };
}

module.exports = ValueObject;
