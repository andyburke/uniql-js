'use strict';

const extend = require( 'extend' );

function _extract_comparison( node ) {
    if ( node.arguments.length !== 2 ) {
        throw new Error( 'JS: A comparison must have only to arguments, a left-hand-side and a right-hand-side.' );
    }

    return {
        lhs: node.arguments[ 0 ],
        rhs: node.arguments[ 1 ]
    };
}

function _create_comparison_operator( compiler, operator ) {
    return node => {
        const comparison = _extract_comparison( node );
        return ` ${ compiler._process_node( comparison.lhs ) } ${ operator } ${ compiler._process_node( comparison.rhs ) } `;
    };
}

module.exports = {
    create: _options => {
        const options = extend( true, {}, _options );
        const compiler = extend( true, {}, {
            compile: function( tree ) {
                const compiled = this._process_node( tree );
                return this.post_process( compiled );
            },

            post_process: function( compiled ) {
                return compiled.trim().replace( /\s+/g, ' ' );
            },

            _process_node: function( node ) {
                if ( !( node.type in this.generators ) ) {
                    throw new Error( 'invalid node type' );
                }

                return this.generators[ node.type ]( node );
            }
        }, options );

        compiler.generators = extend( true, {
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
                    return compiler._process_node( arg );
                } ).join( ', ' ) } ]`;
            },

            '-': function( node ) {
                return ` -( ${ compiler._process_node( node.arguments[ 0 ] ) } ) `;
            },
            '&&': function( node ) {
                const result = [];
                node.arguments.forEach( function( _node ) {
                    result.push( compiler._process_node( _node ) );
                } );
                return ` ${ result.join( ' && ' ) } `;
            },
            '||': function( node ) {
                const result = [];
                node.arguments.forEach( function( _node ) {
                    result.push( compiler._process_node( _node ) );
                } );
                return ` ${ result.join( ' || ' ) } `;
            },
            'IN': function( node ) {
                const value = compiler._process_node( node.arguments[ 0 ] );
                const field = compiler._process_node( node.arguments[ 1 ] );
                return ` ${ field }.includes( ${ value } ) `;
            },
            '!': function( node ) {
                return ` !${ compiler._process_node( node.arguments[ 0 ] ) } `;
            },
            '==': _create_comparison_operator( compiler, '==' ),
            '!=': _create_comparison_operator( compiler, '!=' ),
            '<': _create_comparison_operator( compiler, '<' ),
            '<=': _create_comparison_operator( compiler, '<=' ),
            '>': _create_comparison_operator( compiler, '>' ),
            '>=': _create_comparison_operator( compiler, '>=' ),
            'MATCH': function( node ) {
                const comparison = _extract_comparison( node );
                return ` ${ compiler._process_node( comparison.lhs ) }.match( new RegExp( ${ compiler._process_node( comparison.rhs ) } ) ) `;
            },
            'EXPRESSION': function( node ) {
                const result = [];
                node.arguments.forEach( function( _node ) {
                    result.push( compiler._process_node( _node ) );
                } );
                return ` ( ${ result.join( ' ' ) } ) `;
            }
        }, options.generators );

        return compiler;
    }
};