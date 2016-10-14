import _ from 'underscore';
import createComposites from './create-composites';
import applyParsers from './apply-parsers';

export default function (value, parsers, composites) {
    const object = {};

    // Set the initial value in case it doesn't change
    object.value = value;
    object.original = value;

    let parsedValues;
    // If PreParsers exist then use them to create new properties
    if (parsers) {
        parsedValues = applyParsers(object, parsers);
        _.extend(object, parsedValues);
    }

    // If composites exist then use pre-parsed values to create them
    if (composites) {
        const createdComposites = createComposites(parsedValues, composites);
        _.extend(object, createdComposites);

        // If the value isn't already an object then make it one
        if (!(object.value instanceof Object)) {
            object.value = {};
        }
        _.extend(object.value, createdComposites);
    }

    return object;
}
