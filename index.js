const findBabelConfig = require( 'find-babel-config' );
const { createTransformer } = require( 'babel-jest' );

const SHAM_UI_MACRO_PKG = 'sham-ui-macro/ref.macro';

function isInternal( filename ) {
    return undefined !== [
        '/sham-ui-templates/',
        '/sham-ui-macro/'
    ].find( x => filename.includes( x ) );
}

const { config } = findBabelConfig.sync( process.cwd() );
const jestTransformer = createTransformer( {
    ...config
} );

module.exports = {
    process( src, filename, cfg, transformOptions ) {
        if (
            isInternal( filename ) || (
                filename.includes( 'node_modules' ) &&
                !src.includes( SHAM_UI_MACRO_PKG )
            )
        ) {
            return src;
        }
        try {
            return jestTransformer.process(
                src,
                filename,
                cfg,
                transformOptions
            );
        } catch ( error ) {
            console.error( error );
            return src;
        }
    }
};
