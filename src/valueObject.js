var ValueObject = {
    define: function(name, definition) {
        if ( ! name) { throw Error('Value objects require a name.'); }
        if ( ! definition) { throw Error('Value objects require a definition.'); }
    }
}
 
module.exports = ValueObject;
