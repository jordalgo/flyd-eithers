# Flyd-Eithers

A utility library for working with Eithers in [flyd](https://github.com/paldepind/flyd) streams.

This allows for error bubbling and safe transformations within flyd streams. Examples below.

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
var c = flydEithers
  .toEither(a)
  .map(function(x) { return x + 1; })
  .scan(function(acc, x) { return acc + x; }, 10);

flyd.on(console.log.bind(console), c);

var count = 0;
setInterval(function() {
  count++;
  a(count);
}, 1000);

// Right(12);
// Right(15);
// etc..
```

## Error Example

```javascript
var a = flyd.stream();
var c = flydEithers
  .toEither(a)
  .map(function(x) { return x + 1; })
  .scan(function(acc, x) { return acc + x; }, 10);

flyd.on(console.log.bind(console), c);

function mockHttpRequest() {
  setTimeout(function() {
    a(S.Left('error 404'));
  }, 100);
}

mockHttpRequest();

// Left('error 404') // Safe travel through map and scan :)
```

## Error Example 2

```javascript
var a = flyd.stream();
var c = flydEithers
  .toEither(a)
  .map(function(x) { throw new Error('some error'); })
  .scan(function(acc, x) { return acc + x; }, 10);

flyd.on(console.log.bind(console), c);
a(5);

// Left('some error') // Error caught safely.
```


