export default function getRawValue(value) {
    let rawValue = value;
    if (value instanceof Object) {
        rawValue = {};
        Object.entries(value).forEach(([property, propertyValue]) => {
            rawValue[property] = getRawValue(propertyValue.valueOf());
        });
    }
    return rawValue;
}
