var ValueObject = {
    define: function(name) {
        if ( ! name) {
            throw Error('Value objects require a name.');
        }
    }
}
 
module.exports = ValueObject;
