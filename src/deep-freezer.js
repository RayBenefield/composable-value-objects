const isWritable = function isWritable(object, property) {
    const propertyDescriptor = Object.getOwnPropertyDescriptor(object, property);
    return !propertyDescriptor
        || (propertyDescriptor.writable && propertyDescriptor.writable === true);
};

// The in-memory database for flyweight objects
const DeepFreezer = (function freezer() {
    let db = Object.create(null);
    return {
        repackage(object) {
            // Retrieve the property names defined on obj
            const propNames = Object.getOwnPropertyNames(object);

            // Freeze properties before freezing self
            propNames.forEach((name) => {
                const prop = object[name];

                // Freeze prop if it is an object
                if (isWritable(object, name)) {
                    this.repackage(prop);
                    object[name] = this.retrieve(prop); // eslint-disable-line no-param-reassign
                    if (!object[name]) {
                        object[name] = this.store(prop); // eslint-disable-line no-param-reassign
                    }
                }
            });
        },
        retrieve(value, Type) {
            let tableName = '_generic';

            // If it is a type then use the name of the type
            if (Type) { tableName = Type.name; }

            // Store objects by type in "tables"
            let table = db[tableName];

            // If there is no table then we'll create it
            if (!table) {
                table = db[tableName] = Object.create(null);
            }

            // We need to store the value objects based on its value. In that way we can
            // easily search if it already exists. Because the value might be anything
            // and we can use strings as a key we need to encode it to JSON.
            const key = JSON.stringify(value);

            // If it already exists then we'll re-use it
            if (table[key]) return table[key];
            return false;
        },
        store(value, Type) {
            let tableName = '_generic';

            // If it is a type then use the name of the type
            if (Type) { tableName = Type.name; }

            // Store objects by type in "tables"
            let table = db[tableName];

            // If there is no table then we'll create it
            if (!table) {
                table = db[tableName] = Object.create(null);
            }

            // We need to store the value objects based on its value. In that way we can
            // easily search if it already exists. Because the value might be anything
            // and we can use strings as a key we need to encode it to JSON.
            const key = JSON.stringify(value);

            // Otherwise let's create the object if we were given a Type and return it
            if (Type) {
                table[key] = new Type(value);
                return table[key];
            }

            // If no Type was given let's just store it and return it
            table[key] = value;
            return table[key];
        },
        clear() {
            db = Object.create(null);
        },
    };
}());

export default DeepFreezer;
