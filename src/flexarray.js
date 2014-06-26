var FlexArray = {
	Int8:         factory( Int8Array ),
	Uint8:        factory( Uint8Array ),
	Uint8Clamped: factory( Uint8ClampedArray ),
	Int16:        factory( Int16Array ),
	Uint16:       factory( Uint16Array ),
	Int32:        factory( Int32Array ),
	Uint32:       factory( Uint32Array ),
	Float32:      factory( Float32Array ),
	Float64:      factory( Float64Array )
};

function factory ( TypedArray ) {
	var FlexArray, type;

	type = getType( new TypedArray() );

	FlexArray = function ( chunkLength ) {
		this._chunkLength = chunkLength || 1024; // default to 1kb

		this._pointer = 0;
		this._chunks = [
			( this._chunk = new TypedArray( this._chunkLength ) )
		];
	};

	FlexArray.prototype = {
		write: function ( data ) {
			var i, len, chunk;

			if ( this._baked ) {
				throw new Error( 'You cannot write to a flexible array after calling its bake() method' );
			}

			if ( typeof data === 'number' ) {
				if ( this._pointer >= this._chunkLength ) {
					chunk = this._chunks[ this._chunks.length ] = new TypedArray( this._chunkLength );
					this._chunk = chunk;
					this._pointer = 0;
				}

				this._chunk[ this._pointer++ ] = data;
			}

			else if ( Array.isArray( data ) || getType( data ) === type ) {
				len = data.length;
				for ( i = 0; i < len; i += 1 ) {
					this.write( data[i] );
				}
			}

			else {
				throw new Error( 'Can only write numbers, arrays of numbers, or typed arrays of the same type - ' + type );
			}

			return this.length;
		},

		bake: function () {
			var totalLength, numChunks, result, i, j, p, chunk, length;

			if ( !this._baked ) {
				numChunks = this._chunks.length;

				if ( !numChunks ) {
					return new TypedArray( 0 );
				}

				totalLength = this._pointer + ( numChunks - 1 ) * this._chunkLength;

				result = new TypedArray( totalLength );

				p = 0;
				for ( i = 0; i < numChunks; i += 1 ) {
					chunk = this._chunks[i];

					length = chunk.length;
					for ( j = 0; j < length; j += 1 ) {
						result[p++] = chunk[j];
					}
				}

				// free up memory used by chunks
				this._chunk = this._chunks = null;
				this._baked = result;
			}

			return this._baked;
		}
	};

	return FlexArray;
}

function getType ( object ) {
	return Object.prototype.toString.call( object );
}

