// Base class for page objects.
// Inherit this class for each page object you create. Methods and variables
// in this object will then be available for all children pages.

class Page {
	// Intialize children page objects with pageUrl.
	constructor({ pageUrl = '' }) {
		this.pageUrl = pageUrl;
		// When waiting for a thing, this is the max time to wait.
		this.waitTimeout = 45000;
	}

	get() {
		browser.get(`${sitePrefix}${this.pageUrl}`);
	}

	// Pass in an element object and wait for it to be present.
	waitForElement(element) {
		browser.driver.wait(function() {
			return element.isPresent();
		}, this.waitTimeout);
	}

	// Pass in a string, and wait for the URL to contain that string
	waitForUrl(expectedUrlFragment) {
		browser.driver.wait(function() {
			return browser.driver.getCurrentUrl().then(function(url) {
				return new RegExp(expectedUrlFragment).test(url);
			});
		}, this.waitTimeout);
	}
}

module.exports = Page;
