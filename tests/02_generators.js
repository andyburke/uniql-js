'use strict';

const uniql = require( 'uniql' );
const uniql_to_js_compiler = require( '../src/compiler.js' );

const compiler = uniql_to_js_compiler.create( {
    generators: {
        SYMBOL: node => {
            return node.arguments[ 0 ].toUpperCase();
        }
    }
} );

test( 'foo < 10 => FOO < 10', () => {
    expect( compiler.compile( uniql( 'foo < 10' ) ) ).toBe( 'FOO < 10' );
} );
