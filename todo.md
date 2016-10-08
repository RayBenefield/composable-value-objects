 - Add regular expression checking for errors
 - Add custom error handling
 - Do pre-checking for parsers that try to edit already existing immutable properties at definition
 - Finish example
 - Add error handling callback on instantiation
 - Create equality tests checking value to value and value to property
 - Check immutability of arrays
 - Create a cached string and value object
 - Added Object Freezing

Deep Freezer plan:
 - freezer.freezeContents(this) // will only deepFreeze all properties
 - freezer.deepFreeze(this) // will completely seal the object
 - deepFreeze will check the freezer to see if it already exists before freezing
 - deepFreeze will add to the freezer after freezing


[x] Switch over to ES6 standards

[x] Include roadmap in readme

[x] Finish readme

[x] Create flyweight DB
