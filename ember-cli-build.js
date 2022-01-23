'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function (defaults) {
  let app = new EmberApp(defaults, {
    // Add options here
  });

  // Use `app.import` to add additional libraries to the generated
  // output files.
  //
  // If you need to use different assets in different
  // environments, specify an object as the first parameter. That
  // object's keys should be the environment name and the values
  // should be the asset to use in that environment.
  //
  // If the library that you are including contains AMD or ES6
  // modules that you would like to import into your application
  // please specify an object with the list of modules as keys
  // along with the exports of each module as its value.

  /**
   * We can't use embroider until
   *
   * https://github.com/embroider-build/embroider/issues/1020
   *  is resolved
   */
  // return app.toTree();
  // _but_, we can't await import from our public directory without emborider...
  // so I guess we just can't use v2 addons that import v1 addons for now....

  const { Webpack } = require('@embroider/webpack');

  return require('@embroider/compat').compatBuild(app, Webpack, {
    staticAddonTestSupportTrees: true,
    staticAddonTrees: true,
    staticHelpers: true,
    staticModifiers: true,
    staticComponents: true,
    // splitAtRoutes: ['route.name'], // can also be a RegExp
    // packagerOptions: {
    //    webpackConfig: { }
    // }
    extraPublicTrees: [],
  });
};
