const Page = require('./base.page.js');
class LoginPage extends Page {
	constructor() {
		super({
			pageUrl: ''
		});
		this.fieldUsername = element(by.id('username'));
		this.fieldPassword = element(by.id('password'));
	}
	clickUsername() {
		this.waitForElement(this.fieldUsername);
		this.fieldUsername.click();
	}
	clickPassword() {
		this.waitForElement(this.fieldPassword);
		this.fieldPassword.click();
	}
}
module.exports = LoginPage;
