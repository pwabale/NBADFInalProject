import { browser, by, element } from 'protractor';

describe('Budget App Home Page', () => {
  beforeEach(() => {
    browser.get('/');
  });

  it('should display welcome message', () => {
    const welcomeMessage = element(by.css('.home-page h1'));
    expect(welcomeMessage.getText()).toEqual('Welcome to the Budget App');
  });

  it('should display a description about managing expenses', () => {
    const description = element(by.css('.home-page p'));
    expect(description.getText()).toContain('Manage your expenses and track your budget with ease!');
  });

  it('should have a "Get Started" link leading to the login page', () => {
    const getStartedLink = element(by.css('.home-page a'));
    expect(getStartedLink.getText()).toEqual('Get Started');

    // Click the link and assert the redirection
    getStartedLink.click();
    const currentUrl = browser.getCurrentUrl();
    expect(currentUrl).toContain('/login');
  });
});