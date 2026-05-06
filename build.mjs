import * as esbuild from 'esbuild';
import { sassPlugin } from 'esbuild-sass-plugin';

const isDev = process.argv.includes('--dev');

async function build() {
  try {
    console.log('Building React MFE with esbuild (all bundled)...');

    const result = await esbuild.build({
      entryPoints: ['src/help-desk-element.jsx'],
      bundle: true,
      format: 'esm',
      target: 'esnext',
      outfile: 'dist/help-desk-app.js',
      jsx: 'automatic',
      loader: {
        '.js': 'jsx',
        '.jsx': 'jsx',
        '.css': 'css',
      },
      plugins: [sassPlugin()],
      minify: !isDev,
      sourcemap: isDev,
      define: {
        'process.env.NODE_ENV': isDev ? '"development"' : '"production"',
      },
      // Bundle EVERYTHING - no externals
      // This ensures no require() calls for React, react-dom, etc.
    });

    console.log('✓ Build complete: dist/help-desk-app.js');
    console.log('  - All dependencies bundled (no require() calls)');
    return result;
  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
}

build();
