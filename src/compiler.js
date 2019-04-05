'use strict';

module.exports = compile;

function _extractComparison( node ) {
    if ( node.arguments.length !== 2 ) {
        throw new Error( 'JS: A comparison must have only to arguments, a left-hand-side and a right-hand-side.' );
    }

    return {
        lhs: node.arguments[ 0 ],
        rhs: node.arguments[ 1 ]
    };
}

function _create_comparison_operator( operator ) {
    return node => {
        const comparison = _extractComparison( node );
        return ` ${ _processNode( comparison.lhs ) } ${ operator } ${ _processNode( comparison.rhs ) } `;
    };
}

const generators = {
    'NUMBER': function( node ) {
        return node.arguments[ 0 ].indexOf( '.' ) !== -1 ? parseFloat( node.arguments[ 0 ] ) : parseInt( node.arguments[ 0 ], 10 );
    },
    'STRING': function( node ) {
        return `"${ node.arguments[ 0 ].replace( '"', '\\"' ) }"`;
    },
    'BOOLEAN': function( node ) {
        return node.arguments[ 0 ].toLowerCase() === 'true' ? 'true' : 'false';
    },
    'PRIMITIVE': function( node ) {
        switch ( node.arguments[ 0 ].toLowerCase() ) {
            case 'null':
                return 'null';
            case 'undefined':
                return 'undefined';
            default:
                throw new Error( `Unknown PRIMITIVE type: ${ node.arguments[ 0 ] }` );
        }
    },
    'SYMBOL': function( node ) {
        return node.arguments[ 0 ];
    },
    'ARRAY': function( node ) {
        return `[ ${ node.arguments.map( arg => {
            return _processNode( arg );
        } ).join( ', ' ) } ]`;
    },

    '-': function( node ) {
        return ` -( ${ _processNode( node.arguments[ 0 ] ) } ) `;
    },
    '&&': function( node ) {
        const result = [];
        node.arguments.forEach( function( _node ) {
            result.push( _processNode( _node ) );
        } );
        return ` ${ result.join( ' && ' ) } `;
    },
    '||': function( node ) {
        const result = [];
        node.arguments.forEach( function( _node ) {
            result.push( _processNode( _node ) );
        } );
        return ` ${ result.join( ' || ' ) } `;
    },
    'IN': function( node ) {
        const value = _processNode( node.arguments[ 0 ] );
        const field = _processNode( node.arguments[ 1 ] );
        return ` ${ field }.includes( ${ value } ) `;
    },
    '!': function( node ) {
        return ` !${ _processNode( node.arguments[ 0 ] ) } `;
    },
    '==': _create_comparison_operator( '==' ),
    '!=': _create_comparison_operator( '!=' ),
    '<': _create_comparison_operator( '<' ),
    '<=': _create_comparison_operator( '<=' ),
    '>': _create_comparison_operator( '>' ),
    '>=': _create_comparison_operator( '>=' ),
    'MATCH': function( node ) {
        const comparison = _extractComparison( node );
        return ` ${ _processNode( comparison.lhs ) }.match( new RegExp( ${ _processNode( comparison.rhs ) } ) ) `;
    },
    'EXPRESSION': function( node ) {
        const result = [];
        node.arguments.forEach( function( _node ) {
            result.push( _processNode( _node ) );
        } );
        return ` ( ${ result.join( ' ' ) } ) `;
    }
};

function _processNode( node ) {
    if ( !( node.type in generators ) ) {
        throw new Error( 'invalid node type' );
    }

    return generators[ node.type ]( node );
}

function compile( tree ) {
    const result = _processNode( tree );
    return result.trim().replace( /\s+/g, ' ' );
}