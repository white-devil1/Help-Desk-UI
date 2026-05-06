const { build } = require('@softarc/native-federation-esbuild');
const federationConfig = require('./federation.config.cjs');

build(federationConfig).catch(console.error);
