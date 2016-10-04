 - Allow deriving new ValueObjects
     - Copies the entire original value except for a single property if the original value was an object
     - This cannot affect parsed out properties, deriving will only change the original value used to create it
 - Allow extension
     - Allow extending from another object, having its methods tacked on to the VOs methods
     - This allows natural strings to be treated like strings with split(), join(), etc.
 - Allow inheritance
     - Allow an object to inherit the definition of another object without being composed by it
     - Copies the entire definition from the other object and overwrites with new versions
     - This allows keeping parsing methods of something like an Email, while changing the validation (like having domain requirements for the email)
     - Parsing methods can be overwritten, but old ones are kept and new ones are added on
 - Allow deep parsing
     - If a parser is a function then it acts as a parser, but if it is an object then it is a list of parsers to be processed at that step
     - This requires ordering so may require using a Map object or allowing a Map object in addition to literal objects
     - Doing this allows for multiple nested levels
 - Error handling
     - If validation fails you may throw a custom exception
     - Also provide a callback onError instead of throwing an exception
 - Auto-detect Compositions
     - If an AddressLine can be composed of a Zipcode, State, and City then they should be passable in any order on definition
     - new AddressLine(ZipCode, State, City)
     - new AddressLine(State, City, ZipCode)
 - Flyweight library
     - Because all same value objects are the same, new objects shouldn't be instantiated based on the same original value
 - No configuration
     - Allow ValueObjects to be constructed from the base type that provides deep immutability on entry for complex objects
     - Probably requires that I remove requiring a validate function
     - Example HTTP Request
 - Standardized ValueObjects
     - Package standard ValueObjects like EmailAddress
     - Publish these to NPM and keep a record of all of them

---

 - Eventually handle truly complex parsing
     - Should eventually be able to parse out an entire script file parsing out key details
     - Imagine a CsharpClass value object that parses out the class, interfaces, public methods, etc.
 - Handle format variation parsing
     - Using PreParsers, a ValueObject can define a "type" and use that to Parse out values in a particular way
     - This allows for variations in formatting, but results in the same details of a ValueObject in the end
 - Allow reconstruction
     - Perserves the original value to store in persistence to reconstruct later
 - Allow composition
     - Map properties of the ValueObject to another ValueObject class
     - When getting values of the top level object, the lower level objects map to a property with their camelCase name and their value
     - Example: Address line VO composed of Zipcode, City, and State
        `new AddressLine('Eugene, OR, 97405').valueof();`
        ```
        {
            zipcode: 96405,
            city: Eugene,
            state: Oregon
        }
        ```
 - Allow parsing
     - Parsing is enabled through passing a list of parser functions mapped to properties
     - PreParsers may be passed to allow for parsing just to find a validation value
     - PostParsers may be passed to cache parsed out data AFTER validation
     - Because PostParsers are applied after validation they cannot be used to change or add to the value or else validation becomes irrelevant
 - Allow composed validation
     - If a PreParser and a Composition is defined for the same property, the PreParser result is passed as the value of the Composition class
     - This allows nested validation and segregation of validation
     - Imagine a WrittenEmail with multiple parts that include a Subject, FromAddress, ToAddress, Body, Attachments
         - FromAddress and ToAddress are passed as Compositions mapped to the EmailAddress class
         - PreParsing pulls out the From and To Addresses and prior to WrittenEmail.validate(), EmailAddress.validate() is called for both
         - Processing order:
             - PreParse WrittenEmail
                 - PreParse FromAddress
                 - PreParse ToAddress
                 - Validate FromAddress
                 - PostParse FromAddress
                 - Validate ToAddress
                 - PostParse ToAddress
             - Validate WrittenEmail
             - PostParse WrittenEmail
 - Deep immutability
     - Every property, nested property, parsed property, etc. defined are written as immutable
