import isWritable from './is-writable';
import createImmutableProperty from './create-immutable-property';

export default function makeImmutable(value) {
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
}
