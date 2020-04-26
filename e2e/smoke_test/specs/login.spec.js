describe("Login and Authentication", function() {
  const LoginPage = require("../../common/pages/login.page.js");
  
  describe("Login Page", function() {
    const page = new LoginPage();
    it("navigates to the login page", function() {
      page.get();
    });

    it("Enters Username", function() {
      page.clickUsername();
      browser
        .actions()
        .sendKeys("example@noinc.com")
        .perform();
    });

    it("Enters Password", function() {
      page.clickPassword();
      browser
        .actions()
        .sendKeys("Password")
        .perform();
    });

    it("Clicks Login", function() {
      page.clickLogin();
    });
  });
});
