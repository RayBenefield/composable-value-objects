import isWritable from './is-writable';

export default function applyParsers(object, parsers) {
    const results = {};

    Object.entries(parsers).forEach(([property, parser]) => {
        const properties = property.split('.');
        let focus = results;

        // For each property level we need to go deeper
        properties.some((nestedProperty, index) => {
            // When we get to the last nestedProperty it gets parsed
            if (index === properties.length - 1) {
                if (isWritable(focus, nestedProperty)) {
                    if (typeof parser === 'function') {
                        if (!(typeof focus[nestedProperty] === 'object')) {
                            focus[nestedProperty] = parser(object);
                        }
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
    });

    return results;
}
