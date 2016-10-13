export default function (object, property) {
    const propertyDescriptor = Object.getOwnPropertyDescriptor(object, property);
    return !propertyDescriptor
        || (propertyDescriptor.writable && propertyDescriptor.writable === true);
}
