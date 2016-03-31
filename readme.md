# Flyd-Eithers

A utility library for working with Eithers in [flyd](https://github.com/paldepind/flyd) streams.

## [API](./API.md)

## Dependencies

You need to provide your own Either constructor/lib/implementation.
This lib was tested with Eithers from both [Sanctuary](https://github.com/plaid/sanctuary) and [Data.Either](https://github.com/folktale/data.either).

## Example Usage

```javascript
var S = require('Sanctuary');
var flydEithers = require('flyd-eithers')(S);
var flyd = require('flyd');

var a = flyd.stream();
var b = flydEithers.toEither(a);
var c = b.map(function(x) { return x + 1; });

flyd.on(function(x) {
  console.log(x);
}, c);

var count = 0;
setInterval(function() {
  a(count++);
}, 1000);

// Right(1);
// Right(2);
// etc..
```



