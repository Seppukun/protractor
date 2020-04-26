// Main entrypoint to the test suite.
const colors = require('colors/safe');

const packageInfo = require('./package');

const log = (message, color = 'white') => {
    console.log(colors[color](message));
};

(initialize => {
    log('\nTest Suite', 'bgGreen');
    log(packageInfo.description, 'green');
    log(`Author: ${packageInfo.author}`, 'green');
    log('\nUsage:');
    log('\nHow to run the e2e test suite');
    log('\n\tyarn run e2e-help');
    log('\nRun the unit test suite:');
    log('\n');
    process.exit(0);
})();
