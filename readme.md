# Overview

The `Composable Value Object [CVO]` project shoots to spread the importance of immutability by providing a system that creates deep immutability, preprocessing of data, and up front validation. This project enforces working only with valid data by preventing invalid Value Objects from being created and using immutability to ensure it keeps its validity. Immutability increases confidence in coding and reduces the risk for bugs.


# TL;DR

CVO provides a way to define constructors for completely immutable `ValueObjects`.

### Features

 - **Up-front Validation** - Invalid values are immediately handled on instantiation
 - **Deep Immutability** - Nested object values are immutable; solidifying their validity
 - **Infinite Composition** - Nest `ValueObjects` for easy complex validation/parsing
 - **Shareable Modularity** - Thanks to composition; create/find/inherit shareable `ValueObjects`
 - **Cached Parsing** - Define derived data up front to prevent later processing

### Future Goals

 - **Search** - Easily find and install other CVOs published to NPM for your needs
 - **Extension** - Extend other objects to 'borrow' their functions like `String` for an `Email`
 - **Inheritance** - Inherit a `ValueObject's` definition with minor changes: `CompanyEmail`
 - **No Configuration** - Use the base `ValueObject` to create immutable data
 - **Auto-detect Composites** - Pass in multiple defined composites and CVO will handle the parsing
 - **Scaffolding** - Get up and running quickly by defining the data that needs to exist upfront
 - **Flyweight Library** - `ValueObjects` are the same with the same value, no need for do more work
 - **Leverage ImmutableJS** - Facebook has created a powerful Immutable primitives library
 - **Performance Testing** - Be conscious about the speed relating to `ValueObjects`
 - **Browser Compatibility** - Ensure that `ValueObjects` can be used in the browser


# Installation

```
npm install --save composable-value-objects
```


# Basic Usage

Import/require the `composable-value-objects` to open up the ability to define a new ValueObject. Call the `define()` method with a `name` and a `definition` object. The only required field in the `definition` is the `validate` function.

```js
// email.js
import ValueObject from 'composable-value-objects';

const Email = ValueObject.define('Email', {
    validate: function(object) {
        return /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            .test(object.value);
    }
});

export default Email;
```

The exported module is now a constructor for your new `ValueObject`. To use your new `ValueObject` use the following.

```js
// index.js
import Email from './email';

const userEmail = new Email('billy.bob@gmail.com');
```


### Validation

Validation for `ValueObjects` is extremely important. The `validate()` function ensures that when your `ValueObject` is instantiated it can never be instantiated with an invalid value. If an invalid value is used, your `ValueObject` will throw an error. The `ValueObject` being instantiated is passed to the `validate()` function.

```js
// Throws an error
const userEmail = new Email('billy.bob');
```


### Immutability

Once a `ValueObject` has been instantiated (and thus validated), it can no longer be changed. The value of the object is stored in `<valueObject>.value` and a raw version of the `value` may be access with `<valueObject>.valueof()` (we'll explore the difference in a later section).

```js
const userEmail = new Email('billy.bob@gmail.com');

console.log(userEmail.value); // billy.bob@gmail.com
console.log(userEmail.valueOf()); // billy.bob@gmail.com

// Will not change anything; will throw an error with `use strict`
userEmail.value = 'testing@gmail.com';

console.log(userEmail.value); // billy.bob@gmail.com
console.log(userEmail.valueOf()); // billy.bob@gmail.com
```


# Parsing

Sometimes when you have a value, it isn't in the form that you need it to be in. Perhaps it is in the midst of a paragraph, email, or other unstructured set of data and it needs to be pulled out. CVO allows developers to define parsing methods to morph or create new properties out of the original value. On instantiation the original value that is passed into the constructor can be found with `<valueObject>.original`. Like everything else, this is field is immutable. There are two types of parsers that can be defined in a `ValueObject`.

Each kind of parser accepts an object of properties as keys, and a parsing function as each properties parser function. The return of the function will be set to the property of its respective key. These parsed properties, like the rest of the object, are immutable after validation.


### Pre-Parsers

The purpose of `preParsers` is to parse out data that may be needed in the `validate()` function. The `value` property at this point is not yet immutable and may be parsed into something more useful.

```js
// email.js
import ValueObject from 'composable-value-objects';

const Email = ValueObject.define('Email', {
    preParsers: {
        value: function(object) {
            return object.original.split(',')[1];
        }
    },
    validate: function(object) {
        return /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            .test(object.value);
    }
});

export default Email;
```

```js
// index.js
import Email from './email';

const userEmail = new Email('Billy Bob, billy.bob@gmail.com, 111-222-3333, Las Vegas, NV');

console.log(userEmail.original); // Billy Bob, billy.bob@gmail.com, 111-222-3333, Las Vegas, NV
console.log(userEmail.value); // billy.bob@gmail.com
console.log(userEmail.valueOf()); // billy.bob@gmail.com
```

Other properties may be added to the `ValueObject` as well using other `preParsers` in the `definition`. Pre-parsed values are typically used to assist in validation.

```js
// definition object
preParsers: {
    value: function(object) {
        return object.original.split(',')[1];
    },
    user: function(object) {
        return object.value.split('@')[0];
    },
    domain: function(object) {
        return object.value.split('@')[1];
    }
},
validate: function(object) {
    return /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        .test(object.value)
        && object.domain !== 'gmail.com';
}
```

```js
// index.js

// Valid
const userEmail2 = new Email('Jack, jack@allowed-domain.com, 222-333-4444, Las Vegas, NV');

console.log(userEmail2.domain); // allowed-domain.com

// Throws an error since the `domain` is 'gmail.com'
const userEmail = new Email('Billy Bob, billy.bob@gmail.com, 111-222-3333, Las Vegas, NV');
```


### Post-Parsers

`postParsers` are defined in the same way and almost identical to how `preParsers` work. The major difference is that the fields they have access to are already immutable and validated. `postParsers` are best used for derived data for caching purposes. This allows for computations to happen up front to prevent processing at a later point where processing would be a hindrance.

```js
// definition object
preParsers: {
    value: function(object) {
        return object.original.split(',')[1];
    },
    domain: function(object) {
        return object.value.split('@')[1];
    }
},
validate: function(object) {
    return /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        .test(object.value)
        && object.domain !== 'gmail.com';
},
postParsers: function(object) {
    user: function(object) {
        return object.value.split('@')[0];
    }
}
```


# Composition

The key feature that makes this project different than other value object projects is the ability to compose `ValueObjects` with other `ValueObjects`. By composing larger `ValueObjects` with more compact `ValueObjects`, modular validation and parsing is enabled resulting in simplified definition of larger objects and encouragement of code re-use.

Properties may be pre-parsed out of the top level `ValueObject` and assigned to another `ValueObject`. This parsed out property is passed to the lower level `ValueObject` to be parsed and validated. If it fails, an error is thrown. If it is valid, the new low level `ValueObject` is assigned to the respective property of the top level `ValueObject`.

```js
// definition object in state.js
preParsers: {
    value: function(object) {
        return validStatesArray[object.original];
    }
},
validate: function(object) {
    return object.value;
}
```

```js
// definition object in zipcode.js
validate: function(object) {
    return object.value.length === 5;
}
```

```js
// definition object in address.js
composites: {
    state: State,
    zipcode: Zipcode
},
preParsers: {
    state: function(object) {
        return object.original.state;
    },
    zipcode: function(object) {
        return object.original.zipcode;
    }
},
validate: function(object) {
    return object.state.valueOf() === 'california';
}
```

```js
// index.js
import Address from './address';

const address = new Address({
    state: "CA",
    zipcode: 12345
});

console.log(address.toString());
// {"state":"california","zipcode":12345}

// [address.validate] Error for not being in California
const address2 = new Address({
    state: "OR",
    zipcode: 12345
});

// [state.validate] Error for not being a state
const address2 = new Address({
    state: "blah",
    zipcode: 12345
});

// [zipcode.validate] Error for not being a proper zipcode
const address2 = new Address({
    state: "CA",
    zipcode: "blah"
});
```
