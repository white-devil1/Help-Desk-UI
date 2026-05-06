const { withNativeFederation, shareAll } = require('@angular-architects/native-federation/config');

module.exports = withNativeFederation({
  name: 'help-desk-ui',
  exposes: {
    './HelpDeskApp': './src/remote-entry.jsx',
  },
  shared: {
    react: { singleton: true, requiredVersion: 'auto', import: false },
    'react-dom': { singleton: true, requiredVersion: 'auto', import: false },
    'react-router-dom': { singleton: true, requiredVersion: 'auto', import: false },
    ...shareAll({
      singleton: true,
      strictVersion: true,
      requiredVersion: 'auto',
    }),
  },
  skip: ['rxjs/ajax', 'rxjs/fetch', 'rxjs/testing', 'rxjs/webSocket'],
});
