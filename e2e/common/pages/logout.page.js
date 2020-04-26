const Page = require("./base.page.js");

class LogoutPage extends Page {
  constructor() {
    // Note: super() is required in order to use "this" within the class.
    // initialize with the url and the .get() function will magically work
    super({
      pageUrl: ""
    });

    // Define page elements
    this.linkLogout = element(by.id("header-logout-link"));
  }

  clickLogout() {
    this.waitForElement(this.linkLogout);
    this.linkLogout.click();
  }
}

module.exports = LogoutPage;
