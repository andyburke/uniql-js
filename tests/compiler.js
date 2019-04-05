'use strict';

const uniql = require( 'uniql' );
const uniql_to_js = require( '../src/compiler.js' );

test( 'foo < 10', () => {
    expect( uniql_to_js( uniql( 'foo < 10' ) ) ).toBe( 'foo < 10' );
} );

test( 'foo < 10 and bar > 10', () => {
    expect( uniql_to_js( uniql( 'foo < 10 and bar > 10' ) ) ).toBe( 'foo < 10 && bar > 10' );
} );

test( 'foo < 10 or bar > 10', () => {
    expect( uniql_to_js( uniql( 'foo < 10 or bar > 10' ) ) ).toBe( 'foo < 10 || bar > 10' );
} );

test( '-foo < 10', () => {
    expect( uniql_to_js( uniql( '-foo < 10' ) ) ).toBe( '-( foo ) < 10' );
} );

test( '-foo < -10', () => {
    expect( uniql_to_js( uniql( '-foo < -10' ) ) ).toBe( '-( foo ) < -10' );
} );

test( '-( foo ) < -10', () => {
    expect( uniql_to_js( uniql( '-( foo ) < 10' ) ) ).toBe( '-( ( foo ) ) < 10' );
} );

test( '-( foo or bar ) < -10', () => {
    expect( uniql_to_js( uniql( '-( foo or bar ) < 10' ) ) ).toBe( '-( ( foo || bar ) ) < 10' );
} );

test( '"foo" in [ "foo", "bar", "baz" ]', () => {
    expect( uniql_to_js( uniql( '"foo" in [ "foo", "bar", "baz" ]' ) ) ).toBe( '[ "foo", "bar", "baz" ].includes( "foo" )' );
} );

test( 'foo == undefined', () => {
    expect( uniql_to_js( uniql( 'foo == undefined' ) ) ).toBe( 'foo == undefined' );
} );

test( 'foo == null', () => {
    expect( uniql_to_js( uniql( 'foo == null' ) ) ).toBe( 'foo == null' );
} );

test( 'foo ~= ".*?"', () => {
    expect( uniql_to_js( uniql( 'foo ~= ".*?"' ) ) ).toBe( 'foo.match( new RegExp( ".*?" ) )' );
} );