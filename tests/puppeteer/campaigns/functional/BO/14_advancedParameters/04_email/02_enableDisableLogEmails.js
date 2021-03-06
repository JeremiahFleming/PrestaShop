require('module-alias/register');
const testContext = require('@utils/testContext');

const baseContext = 'functional_BO_advancedParameters_email_enableDisableLogEmails';

const {expect} = require('chai');
const helper = require('@utils/helpers');
const loginCommon = require('@commonTests/loginBO');
// Importing pages
const BOBasePage = require('@pages/BO/BObasePage');
const LoginPage = require('@pages/BO/login');
const DashboardPage = require('@pages/BO/dashboard');
const EmailPage = require('@pages/BO/advancedParameters/email');

let browser;
let page;

// Init objects needed
const init = async function () {
  return {
    boBasePage: new BOBasePage(page),
    loginPage: new LoginPage(page),
    dashboardPage: new DashboardPage(page),
    emailPage: new EmailPage(page),
  };
};

describe('Enable/Disable log emails', async () => {
  // before and after functions
  before(async function () {
    browser = await helper.createBrowser();
    page = await helper.newTab(browser);
    this.pageObjects = await init();
  });
  after(async () => {
    await helper.closeBrowser(browser);
  });

  // Login into BO
  loginCommon.loginBO();

  it('should go to \'Advanced parameters > E-mail\' page', async function () {
    await testContext.addContextItem(this, 'testIdentifier', 'goToEmailPage', baseContext);
    await this.pageObjects.boBasePage.goToSubMenu(
      this.pageObjects.boBasePage.advancedParametersLink,
      this.pageObjects.boBasePage.emailLink,
    );
    const pageTitle = await this.pageObjects.emailPage.getPageTitle();
    await expect(pageTitle).to.contains(this.pageObjects.emailPage.pageTitle);
  });

  const tests = [
    {args: {action: 'disable', exist: false}},
    {args: {action: 'enable', exist: true}},
  ];
  tests.forEach((test, index) => {
    it(`should ${test.args.action} log emails`, async function () {
      await testContext.addContextItem(this, 'testIdentifier', `${test.args.action}LogEmails`, baseContext);
      const result = await this.pageObjects.emailPage.setLogEmails(test.args.exist);
      await expect(result).to.contains(this.pageObjects.emailPage.successfulUpdateMessage);
    });

    it('should check the existence of log emails table', async function () {
      await testContext.addContextItem(this, 'testIdentifier', `checkLogEmailsTable${index}`, baseContext);
      const isVisible = await this.pageObjects.emailPage.isLogEmailsTableVisible();
      await expect(isVisible).to.equal(test.args.exist);
    });
  });
});
