const Page = require("../../common/pages/base.page.js");

class Dashboard extends Page {
  constructor() {
    super({
      pageUrl: ""
    });

    this.example = element(
      by.css('[href="example"]')
    );

    this.example2 = element(
      by.xpath('//*[contains(text(), "example2")]')
    );
  }
  checkExample() {
    this.waitForElement(this.example);
  }

  clickExample2() {
    this.waitForElement(this.example2);
    this.example2.click();
  }
}

module.exports = Dashboard;
