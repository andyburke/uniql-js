UniQL-JS
=======

This generates Javascript based on [UniQL](https://github.com/andyburke/uniql)
ASTs.

## Example

```javascript
const parse = require( 'uniql' );
const uniql_to_js_compiler = require( 'uniql-js' );

const compiler = uniql_to_js_compiler.create();

const ast = parse( `
    ( height <= 20 or
      ( favorites.color == "green" and height != 25 ) )
      and firstname ~= "o.+"` );
const javascript = compiler.compile( ast );
console.log( javascript );
```

Results:

```
( height <= 20 ||
  ( favorites.color == "green" && height != 25 ) )
  && firstname.match( new RegExp( "o.+" ) )
```

## API

```.create( [ options ] )```

Creates a JS compiler. You can override generators for various symbols or the
post-processor for the compiled code, eg:

```javascript
const compiler = uniql_to_js_compiler.create( {
    generators: {
        // eg: rename a certain variable
        SYMBOL: node => {
            const symbol_text = node.arguments[ 0 ];
            if ( symbol_text === 'foo' ) {
                return 'bar';
            }

            return symbol_text;
        }
    },

    // eg: return a markdown block instead of just the compiled code
    post_process: compiled => {
        return `\`\`\`javascript\n${ compiled }\n\`\`\``;
    }
} );
```

## License

[MIT](LICENSE)
