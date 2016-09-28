var ValueObject = {
    define: function(name, definition) {
        if ( ! name) { throw Error('Value objects require a name.'); }
        if ( ! definition) { throw Error('Value objects require a definition.'); }
        if ( ! definition.validate) { throw Error('Value object definitions require validation.'); }
    }
}
 
module.exports = ValueObject;
