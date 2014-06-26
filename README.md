# FlexArray.js

This is an experiment, it may not go anywhere... just something I needed in a project and thought might be useful in future.

## Typed arrays are great...

[Typed arrays](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Typed_arrays) let you deal directly with binary data, like old-school programmers. It's fast, and you can [transfer array buffers](https://developer.mozilla.org/en-US/docs/Web/Guide/Performance/Using_web_workers#Passing_data_by_transferring_ownership_(transferable_objects)) to and from web workers to offload heavy computation to a background process without incurring the (sometimes substantial) costs of [structured cloning](https://developer.mozilla.org/en-US/docs/Web/Guide/API/DOM/The_structured_clone_algorithm).

## ...but

...you need to know the length in advance, which is occasionally problematic. A FlexArray has a `write()` method, which allows you to write data sequentially without worrying about the length, and a `bake()` method which returns an array that's as long as your data.

```js
flex = new FlexArray.Int8();

// Write one bit of data at a time
flex.write( 1 );
flex.write( 2 );
flex.write( 3 );

// Or several, in an array
flex.write([ 4, 5, 6 ]);

// Or from a typed array of the same type
temp = new Int8Array( 3 );
temp[0] = 7;
temp[1] = 8;
temp[2] = 9;

flex.write( temp );


// Get the data back (this frees up the memory used so far,
// and means you can no longer write to the FlexArray
flex.bake();
// -> [ 1, 2, 3, 4, 5, 6, 7, 8, 9 ]
```

It works by creating new 'chunks' as necessary to accommodate your data. The default chunk length is 1024 bytes - you can change that by passing in an argument at the start:

```js
flex = new FlexArray.Int8( 100 ); // we expect to have around 100 bytes of data
flex = new FlexArray.Int8( 1024 * 1024 ); // we're dealing with a megabyte or so
```


## Available types

All [array types](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Typed_arrays) are supported:

```js
flex = new FlexArray.Int8();
flex = new FlexArray.Uint8();
flex = new FlexArray.Uint8Clamped();
flex = new FlexArray.Int16();
flex = new FlexArray.Uint16();
flex = new FlexArray.Int32();
flex = new FlexArray.Uint32();
flex = new FlexArray.Float32();
flex = new FlexArray.Float64();
```


## License

MIT. Go nuts.
