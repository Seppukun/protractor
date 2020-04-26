// Top level suite. Create smaller tests inside the specs directory
// and import them in with require() statements to run them below.
describe("Smoke Test", function() {
    beforeEach(function() {
      browser.waitForAngularEnabled(false);
    });
  
    // Login
    require("./specs/login.spec.js");
  
    // Specs to run

    // Logout
    require("./specs/logout.spec.js");
  });