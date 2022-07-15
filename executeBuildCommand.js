const svgrPlugin = require('esbuild-plugin-svgr');
const esbuild = require('esbuild');
const glob = require('glob');
const plugin = require('node-stdlib-browser/helpers/esbuild/plugin');
const stdLibBrowser = require('node-stdlib-browser');
const { nodeExternalsPlugin } = require('esbuild-node-externals');
const { sassPlugin, postcssModules } = require('esbuild-sass-plugin');

const basedir = 'src';

module.exports = function executeBuildCommand(customOptions = {}) {
  glob('{./src/**/*.tsx,./src/**/*.ts,./src/**/*.scss}', function(err, files) {
    if (err) {
      console.log('error reading files', err);
    }

    esbuild
      .build({
        entryPoints: files,
        outdir: 'dist',
        treeShaking: true,
        minify: true,
        bundle: true,
        sourcemap: true,
        splitting: true,
        chunkNames: '__chunks__/[name]-[hash]',
        format: 'esm',
        target: ['es2015'],
        tsconfig: './tsconfig.json',
        platform: 'node',
        inject: [require.resolve('node-stdlib-browser/helpers/esbuild/shim')],
        define: {
          global: 'global',
          process: 'process',
          Buffer: 'Buffer',
          'process.env.NODE_ENV': `"production"`
        },
        plugins: [
          svgrPlugin(),
          plugin(stdLibBrowser),
          nodeExternalsPlugin(),
          sassPlugin({
            loadPaths: [`./${basedir}`, 'node_modules'],
            basedir,
            transform: postcssModules({
              basedir,
              localsConvention: 'dashes',
              generateScopedName: 'dapp-core-component__[name]__[local]'
            })
          })
        ],
        ...customOptions
      })
      .catch(() => process.exit(1));
  });
};