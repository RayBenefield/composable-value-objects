export default function (object, property, value) {
    Object.defineProperty(object, property, {
        value,
        writable: false,
    });
}
