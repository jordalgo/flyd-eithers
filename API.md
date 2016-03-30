# ap

**Parameters**

-   `E`

Returns **[Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)** the apply function for streams with Eithers.

# ap

Returns a Flyd Stream.
If the operation fails it fills the stream with a Left value.

**Signature**: \`Stream Either a b -> Stream Either a b -> Stream Either a c

**Examples**

```javascript
var s1 = flyd.stream(Right(addOne));
var s2 = flyd.stream(Right(1));
ap(s1, s2)(); //=> Right(2);
```

# endsOnLeft

If the ender stream emits a Left it ends the passed stream.

**Signature**: \`Stream Either a b -> Stream Either a b -> Stream Either a c

**Examples**

```javascript
var s1 = flyd.stream(Right(2));
var s2 = flyd.stream(Right(1));
endsOnLeft(s1, s2);
s1(Left('error'));
s2.end() //=> true
```

# map

**Parameters**

-   `E`

Returns **[Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)** the map function for streams with Eithers.

# map

Returns a Flyd Stream with an Either value.
If the map throws or if the pre-mapped value is a Left,
the returned Stream will contain a Left.

**Signature**: \`(b -> c) -> Stream Either a b -> Stream Either a c

**Parameters**

-   `f` **[Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)** the mapping function

**Examples**

```javascript
var addOne = function(x) { return x+1; };
var s = flyd.stream(Right(5));
map(addOne, s)(); //=> Right(6);
```

# scan

**Parameters**

-   `E`

Returns **[Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)** the scan function for streams with Eithers.

# scan

Returns a Flyd Stream.
If the operation fails it fills the stream with a Left value.

**Signature**: \`(acc -> a -> b) -> Either a b -> Stream Either a c

**Parameters**

-   `f` **[Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)** reducer function
-   `acc` **Either** an either (perhaps containing the accumulator)

**Examples**

```javascript
var add = function(acc, x) { return acc + x; };
var s = flyd.stream(Right(1));
scan(add, Right(5), s)(); //=> Right(6);
```
