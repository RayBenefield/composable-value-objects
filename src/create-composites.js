import createImmutableProperty from './create-immutable-property';

export default function (object, composites) {
    const results = {};

    Object.entries(composites).forEach(([composite, compositeType]) => {
        const Type = compositeType;
        results[composite] = new Type(object[composite]);
        createImmutableProperty(object, composite, object[composite]);
    });

    return results;
}
