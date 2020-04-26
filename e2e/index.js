// Main entrypoint to the Protractor test suite.
const SpecReporter = require('jasmine-spec-reporter').SpecReporter;
const JasmineReporters = require('jasmine-reporters');
const colors = require('colors/safe');
const packageInfo = require('../package');
const config = require('./config');
const params = require('minimist')(process.argv.slice(2));

// Errors will be collected when configuring protractor in the initialize function, and exit
// without attempting to run protractor if errors are critical.
const errors = [];

// This configuration gets built dynamically in the initialize function, with a preference
// to command line parameters, followed by config.json parameters, followed by reasonable defaults if applicable.
const protractorConfig = {};

const log = (message, color = 'white') => {
	console.log(colors[color](message));
};

const exitWithErrors = () => {
	log('\nTestrunner did not start because of the following errors:', 'bgRed');
	for (message of errors) {
		log(message);
	}
	log('\nExiting...\n');
	process.exit(1);
};

const displayHelpAndExit = () => {
	log('\nProtractor Testrunner', 'bgGreen');
	log(packageInfo.description, 'green');
	log(`Author: ${packageInfo.author}`, 'green');
	log('\nUsage:');
	log('\tRun the entire test suite');
	log('\n\t\tyarn run e2e');
	log('\nWith parameters:');
	log('\n\t\tyarn run e2e[-local] -- [--parameter=values]');
	log('\nYou may enter the following parameters which will override default values provided in config.json');
	log('\n\t To specify where selenium is running: \n\t\t--seleniumAddress="http://some.url:port"');
	log('\n\t To run specific suites (roles) from the ./e2e directory: \n\t\t--suites=suite1,suite2,suite3');
	log('\n\t To run specific browsers, type a comma-separated list: \n\t\t--browsers=chrome,firefox,opera');
	log('\n\t To run specific browser resolution (W,H): \n\t\t--resolution=1024,768');
	log('\n\t To run specific OS, type a comma-separated list: \n\t\t--system=MAC,WIN8,XP,WINDOWS,ANY');
	log('\n\t To run specific framework: \n\t\t--framework=jasmine2');
	log(
		'\n\t To use a specific Browserstack login (if not running locally), type a user and key: \n\t\t--browserstackUser=username --browserstackKey=key'
	);
	log('\n\t To run against a specific project URL: \n\t\t--projectUrl="http://some.url"');
	log('\n');
	process.exit(0);
};

((initialize) => {
	// If there is a help flag, show how to run the tests and exit.
	if (params.options) {
		displayHelpAndExit();
	}

	// Load optional selenium address override
	protractorConfig.seleniumAddress = params.seleniumAddress || config.seleniumAddress;

	//Trying to force Direct Connect
	//Do This to test Locally
	protractorConfig.directConnect = [];

	protractorConfig.multiCapabilities = [];
	// Load browsers and OSs
	const browsers = params.browsers ? params.browsers.split(',') : config.browsers.split(',');
	if (!browsers.length) browsers.push('chrome');

	const systems = params.system ? params.system.split(',') : config.system.split(',');
	if (!systems.length) systems.push('ANY');

	for (browser of browsers) {
		for (system of systems) {
			protractorConfig.multiCapabilities.push({
				'browserstack.user': params.browserstackUser || config.browserstackUser,
				'browserstack.key': params.browserstackKey || config.browserstackKey,
				platform: system,
				browserName: browser,
				resolution: params.resolution || config.resolution
			});
		}
	}

	protractorConfig.framework = params.framework || config.framework;

	// Load specific spec files if defined
	if (params.suites) {
		const specs = params.suites.split(',');
		if (!specs.length)
			errors.push('You requested to run specific test suites, but failed to define a list of suites to run.');

		protractorConfig.specs = [];
		for (spec of specs) {
			protractorConfig.specs.push(`${spec}/index.js`);
		}
	} else {
		protractorConfig.specs = [];
		protractorConfig.specs.push('**/index.js');
	}

	// Reporting settings
	protractorConfig.onPrepare = () => {
		jasmine.getEnv().addReporter(
			new SpecReporter({
				spec: {
					displayStacktrace: true
				}
			})
		);
		jasmine.getEnv().addReporter(
			new JasmineReporters.JUnitXmlReporter({
				consolidateAll: true,
				savePath: './results',
				filePrefix: 'xmlresults'
			})
		);

		// Set the testing URL so it is available in all the tests as sitePrefix.
		global.sitePrefix = params.projectUrl || config.projectUrl;

		// Browser resize on selenium
		const resolution = params.resolution || config.resolution;
		browser
			.manage()
			.window()
			.setSize(parseInt(resolution.split('x')[0], 0), parseInt(resolution.split('x')[1], 10));

		// Globally available pages...
		global.LoginPage = require('./common/pages/login.page.js');
	};

	// Check to make sure all minimally required paramters are configured.
	if (!protractorConfig.seleniumAddress)
		errors.push("Please provide a selenium address in config.json or with --seleniumAddress='foo'");
	if (!protractorConfig.specs) errors.push('No specs defined. Nothing to do');

	if (errors.length) {
		exitWithErrors();
	}

	log('\nRunning Protractor with Config:\n', 'bgGreen');
	console.log(protractorConfig);
	log('\nTests output:\n', 'bgGreen');
})();

//HTMLReport called once tests are finished
protractorConfig.onComplete = function() {
	var browserName, browserVersion;
	var capsPromise = browser.getCapabilities();

	capsPromise.then(function(caps) {
		browserName = caps.get('browserName');
		browserVersion = caps.get('version');

		var HTMLReport = require('protractor-html-reporter');

		testConfig = {
			reportTitle: 'Test Execution Report',
			outputPath: './results',
			screenshotPath: './results/screenshots/',
			testBrowser: browserName,
			browserVersion: browserVersion,
			modifiedSuiteName: false,
			screenshotsOnlyOnFailure: true
		};
		new HTMLReport().from('./results/xmlresults.xml', testConfig);
	});
};

exports.config = protractorConfig;
