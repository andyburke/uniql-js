'use strict';

const uniql = require( 'uniql' );
const uniql_to_js_compiler = require( '../src/compiler.js' );

const compiler = uniql_to_js_compiler.create();

test( 'foo < 10', () => {
    expect( compiler.compile( uniql( 'foo < 10' ) ) ).toBe( 'foo < 10' );
} );

test( 'foo < 10 and bar > 10', () => {
    expect( compiler.compile( uniql( 'foo < 10 and bar > 10' ) ) ).toBe( 'foo < 10 && bar > 10' );
} );

test( 'foo < 10 or bar > 10', () => {
    expect( compiler.compile( uniql( 'foo < 10 or bar > 10' ) ) ).toBe( 'foo < 10 || bar > 10' );
} );

test( '-foo < 10', () => {
    expect( compiler.compile( uniql( '-foo < 10' ) ) ).toBe( '-( foo ) < 10' );
} );

test( '-foo < -10', () => {
    expect( compiler.compile( uniql( '-foo < -10' ) ) ).toBe( '-( foo ) < -10' );
} );

test( '-( foo ) < -10', () => {
    expect( compiler.compile( uniql( '-( foo ) < 10' ) ) ).toBe( '-( ( foo ) ) < 10' );
} );

test( '-( foo or bar ) < -10', () => {
    expect( compiler.compile( uniql( '-( foo or bar ) < 10' ) ) ).toBe( '-( ( foo || bar ) ) < 10' );
} );

test( '"foo" in [ "foo", "bar", "baz" ]', () => {
    expect( compiler.compile( uniql( '"foo" in [ "foo", "bar", "baz" ]' ) ) ).toBe( '[ "foo", "bar", "baz" ].includes( "foo" )' );
} );

test( 'foo == undefined', () => {
    expect( compiler.compile( uniql( 'foo == undefined' ) ) ).toBe( 'foo == undefined' );
} );

test( 'foo == null', () => {
    expect( compiler.compile( uniql( 'foo == null' ) ) ).toBe( 'foo == null' );
} );

test( 'foo ~= ".*?"', () => {
    expect( compiler.compile( uniql( 'foo ~= ".*?"' ) ) ).toBe( 'foo.match( new RegExp( ".*?" ) )' );
} );