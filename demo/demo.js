var flex = new FlexArray.Int8();

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
var baked = flex.bake();
console.log( baked );
