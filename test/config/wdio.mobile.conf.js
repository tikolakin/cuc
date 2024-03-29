require('dotenv').config();
const defaultTimeoutInterval = process.env.DEBUG ? (60 * 60 * 500) : 90000;
const path = require('path');
const VRC = require('wdio-visual-regression-service/compare');

const getScreenshotName = basePath => (context) => {
  const browserVersion = parseInt(context.browser.version, 10);
  const browserName = context.browser.name;

  return path.join(
    basePath,
    `${browserName}_${browserVersion}.png`,
  );
};

const VRCPath = 'test/screenshots';

const VRCSaveScreen = new VRC.SaveScreenshot({
  screenshotName: getScreenshotName(
    path.join(process.cwd(), `${VRCPath}/reference`),
  ),
});

const VRCLocalCompare = new VRC.LocalCompare({
  referenceName: getScreenshotName(
    path.join(process.cwd(), `${VRCPath}/reference`),
  ),
  screenshotName: getScreenshotName(
    path.join(process.cwd(), `${VRCPath}/screen`),
  ),
  diffName: getScreenshotName(path.join(process.cwd(), `${VRCPath}/diff`)),
  misMatchTolerance: 0.01,
});

const VRCMethod = process.env.VRC ? VRCSaveScreen : VRCLocalCompare;

exports.config = {

  specs: [
    './test/features/*.feature',
  ],
    // Patterns to exclude.
  exclude: [
        // 'path/to/excluded/files'
  ],
    //
    // ============
    // Capabilities
    // ============
    // Define your capabilities here. WebdriverIO can run multiple capabilities at the same
    // time. Depending on the number of capabilities, WebdriverIO launches several test
    // sessions. Within your capabilities you can overwrite the spec and exclude options in
    // order to group specific specs to a specific capability.
    //
    // First, you can define how many instances should be started at the same time. Let's
    // say you have 3 different capabilities (Chrome, Firefox, and Safari) and you have
    // set maxInstances to 1; wdio will spawn 3 processes. Therefore, if you have 10 spec
    // files and you set maxInstances to 10, all spec files will get tested at the same time
    // and 30 processes will get spawned. The property handles how many capabilities
    // from the same test should run tests.
    //
  maxInstances: 1,

  capabilities: [
    {
      appiumVersion: '1.7.2',
      automationName: 'XCUITest',
      platformName: 'iOS',
           // platformVersion: '9.0',
      deviceName: 'iPhone Simulator',
           // deviceName: 'iPhone 6s',
      browserName: 'Safari',
           // orientation: 'PORTRAIT',
           // nativeInstrumentsLib: true,
           // isolateSimDevice: true,
      clearSystemFiles: true,
            commandTimeout: '7200',
           // app: APP_PATH
    },
    {
      appiumVersion: '1.7.2',
      automationName: 'Appium',
      platformName: 'Android',
           // platformVersion: '9.0',
      avd: 'Nexus_S_API_27',
      deviceName: 'Android Emulator',
           // deviceName: 'iPhone 6s',
      browserName: 'chrome',
           // chromeOptions: {
           //   androidPackage: 'com.android.chrome',
           // },
           // setDebugApp: '--persistent com.android.chrome',
      chromeOptions: {
        args: [
          '--no-managed-user-acknowledgment-check',
          '--no-user-gesture-required',
          '--oobe-force-show-screen ⊗',
        ],
      },
           // orientation: 'PORTRAIT',
           // nativeInstrumentsLib: true,
           // isolateSimDevice: true,
           // clearSystemFiles: true,
           // app: APP_PATH
      commandTimeout: '7200',
      noReset: false,
           // show_on_first_run_allowed: false,
      dontStopAppOnReset: false,
      show_on_first_run_allowed: false,
      show_welcome_page: false,
      appActivity: '.MainActivity',
      appWaitActivity: 'SplashActivity',
      noSign: true,
           // intentCategory: 'android.intent.category.APP_CONTACTS',
           // intentAction: 'android.intent.action.MAIN',
    }
],

  host: '127.0.0.1',
  port: '4723',
  sync: true,
  logLevel: 'silent',     // Level of logging verbosity: silent | verbose | command | data | result | error
  coloredLogs: true,      // Enables colors for log output.
  screenshotPath: './test/reports/errorShots/',   // Saves a screenshot to a given path if a command fails.
    //
    // Set a base URL in order to shorten url command calls. If your url parameter starts
    // with "/", then the base url gets prepended.
  baseUrl: process.env.BASE_URL,
  waitforTimeout: defaultTimeoutInterval,            // Default timeout for all waitFor* commands.
  connectionRetryTimeout: 90000,    // Default timeout in milliseconds for request  if Selenium Grid doesn't send response
  connectionRetryCount: 3,          // Default request retries count
  plugins: {
    //     webdrivercss: {
    //         screenshotRoot: 'my-shots',
    //         failedComparisonsRoot: 'diffs',
    //         misMatchTolerance: 0.05,
    //         screenWidth: [320,480,640,1024]
    //     },
    //     webdriverrtc: {},
    //     browserevent: {}
    'wdio-screenshot': {},
  },
    //
    // Test runner services
    // Services take over a specific job you don't want to take care of. They enhance
    // your test setup with almost no effort. Unlike plugins, they don't add new
    // commands. Instead, they hook themselves up into the test process.
  services: ['appium', 'visual-regression'],
  visualRegression: {
    compare: VRCMethod,
        // viewportChangePause: 300,
        // viewports: [{ width: 1024, height: 768 }],
        // orientations: ['landscape', 'portrait'],
  },
    //
  framework: 'cucumber',
  reporters: ['spec'],

    /* reporterOptions: {
        junit:  {outputDir: './test/reports/junit-results/'},
        allure: {outputDir: './test/reports/allure-results/'},
        json:   {outputDir: './test/reports/json-results/'}
    }, */

    // If you are using Cucumber you need to specify the location of your step definitions.
  cucumberOpts: {
    require: [
      './test/features/step_definitions/steps',
      './test/features/support/world',
    ],        // <string[]> (file/dir) require files before executing features
    backtrace: false,   // <boolean> show full backtrace for errors
    compiler: [],       // <string[]> ("extension:module") require files with the given EXTENSION after requiring MODULE (repeatable)
    dryRun: false,      // <boolean> invoke formatters without executing steps
    failFast: false,    // <boolean> abort the run on first failure
    format: [], // <string[]> (type[:path]) specify the output format, optionally supply PATH to redirect formatter output (repeatable)
    colors: true,       // <boolean> disable colors in formatter output
    snippets: true,     // <boolean> hide step definition snippets for pending steps
    source: true,       // <boolean> hide source uris
    profile: [],        // <string[]> (name) specify the profile to use
    strict: false,      // <boolean> fail if there are any undefined or pending steps
    tags: [],           // <string[]> (expression) only execute the features or scenarios with tags matching the expression
    timeout: defaultTimeoutInterval,     // <number> timeout for step definitions
    ignoreUndefinedDefinitions: false, // <boolean> Enable this config to treat undefined definitions as warnings.
  },

    //
    // =====
    // Hooks
    // =====
    // WedriverIO provides several hooks you can use to interfere with the test process in order to enhance
    // it and to build services around it. You can either apply a single function or an array of
    // methods to it. If one of them returns with a promise, WebdriverIO will wait until that promise got
    // resolved to continue.
    //
    // Gets executed before test execution begins. At this point you can access all global
    // variables, such as `browser`. It is the perfect place to define custom commands.
    // before: function() {
    //   //do your stuff
    // },
    //
    // after: function (capabilities, specs) {
    //   //do your stuff
    // },
    //
    // beforeStep: function (stepResult) {
    //     //do your stuff
    // },
    //
    // afterStep: function (stepResult) {
    //     //do your stuff
    // },
    //
    //
    // beforeFeature: function (feature) {
    //     //do your stuff
    // },
    //
    // afterFeature: function (feature) {
    //     //do your stuff
    // },
    //
    // beforeScenario: function (scenario) {
    //     //do your stuff
    // },
    // afterScenario: function (scenarioResult) {
    //     //do your stuff
    // },
};
