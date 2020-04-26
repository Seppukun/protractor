describe('Logout', function() {
    const LogoutPage = require('../../common/pages/logout.page.js');
    const page = new LogoutPage();

    it('should Logout', function() {
        page.clickLogout();
    });

    it('verifies page logged out and redirected to login page', function() {
        page.waitForUrl('/login');
    });
});
