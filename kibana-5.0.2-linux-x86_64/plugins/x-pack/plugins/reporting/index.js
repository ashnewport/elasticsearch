import { resolve } from 'path';
import mirrorPluginStatus from '../../server/lib/mirror_plugin_status';
const publicRoutes = require('./server/routes/public');
const fileRoutes = require('./server/routes/file');
const jobRoutes = require('./server/routes/jobs');

const phantom = require('./server/lib/phantom');
const createQueue = require('./server/lib/create_queue');
const appConfig = require('./server/config/config');
const checkLicense = require('./server/lib/check_license');
const validateConfig = require('./server/lib/validate_config');

module.exports = function (kibana) {
  return new kibana.Plugin({
    id: 'reporting',
    configPrefix: 'xpack.reporting',
    publicDir: resolve(__dirname, 'public'),
    require: ['kibana', 'elasticsearch', 'xpack_main'],

    uiExports: {
      navbarExtensions: [
        'plugins/reporting/controls/discover',
        'plugins/reporting/controls/visualize',
        'plugins/reporting/controls/dashboard',
      ],
      hacks: [ 'plugins/reporting/hacks/job_completion_notifier'],
      managementSections: ['plugins/reporting/views/management'],
    },

    config: function (Joi) {
      return Joi.object({
        enabled: Joi.boolean().default(true),
        kibanaApp: Joi.string().regex(/^\//).default('/app/kibana'),
        kibanaServer: Joi.object({
          protocol: Joi.string().valid(['http', 'https']),
          hostname: Joi.string(),
          port: Joi.number().integer()
        }).default(),
        queue: Joi.object({
          indexInterval: Joi.string().default('week'),
          pollInterval: Joi.number().integer().default(3000),
          timeout: Joi.number().integer().default(30000),
          syncSocketTimeout: Joi.number().integer(),
        }).default(),
        generate: Joi.object({
          socketTimeout: Joi.number().integer().default(300000),
        }).default(),
        capture: Joi.object({
          zoom: Joi.number().integer().default(1),
          viewport: Joi.object({
            width: Joi.number().integer().default(1320),
            height: Joi.number().integer().default(640)
          }).default(),
          timeout: Joi.number().integer().default(6000),
          loadDelay: Joi.number().integer().default(3000),
          concurrency: Joi.number().integer().default(appConfig.concurrency),
        }).default(),
        encryptionKey: Joi.string()
      }).default();
    },

    init: function (server) {
      const thisPlugin = this;
      const config = server.config();
      validateConfig(config, message => server.log(['reporting', 'warning'], message));

      const xpackMainPlugin = server.plugins.xpack_main;
      mirrorPluginStatus(xpackMainPlugin, thisPlugin);
      xpackMainPlugin.status.once('green', () => {
        // Register a function that is called whenever the xpack info changes,
        // to re-compute the license check results for this plugin
        xpackMainPlugin.info.feature(thisPlugin.id).registerLicenseCheckResultsGenerator(checkLicense);
      });

      function setup() {
        // prepare phantom binary
        return phantom.install(config.get('path.data'))
        .then(function (phantomPackage) {
          server.log(['reporting', 'debug'], `Phantom installed at ${phantomPackage.binary}`);

          // intialize and register application components
          server.expose('phantom', phantomPackage);
          server.expose('queue', createQueue(server));

          // Reporting routes
          publicRoutes(server);
          fileRoutes(server);
          jobRoutes(server);
        })
        .catch(function (err) {
          return thisPlugin.status.red(err.message);
        });
      }

      return setup();
    }
  });
};
