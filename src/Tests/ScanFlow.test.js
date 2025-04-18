const { Builder, By, until } = require('selenium-webdriver');

describe('SecureLink Scanner Tests', () => {
  let driver;

  beforeAll(async () => {
    driver = await new Builder().forBrowser('chrome').build();
  });

  afterAll(async () => {
    await driver.quit();
  });

  test('Scan Google URL', async () => {
    await driver.get('http://localhost:3000'); 
    const inputField = await driver.findElement(By.css('input[type="text"]'));
    const submitButton = await driver.findElement(By.css('button[type="submit"]'));

    await inputField.sendKeys('https://www.google.com');
    await submitButton.click();

    const resultElement = await driver.wait(
      until.elementLocated(By.css('.google-result')),
      10000
    );
    const resultText = await resultElement.getText();
    expect(resultText).toContain('Google Safe Browsing Result');
  });

  test('Scan GitHub URL', async () => {
    await driver.get('http://localhost:3000'); 
    const inputField = await driver.findElement(By.css('input[type="text"]'));
    const submitButton = await driver.findElement(By.css('button[type="submit"]'));

    await inputField.sendKeys('https://www.github.com');
    await submitButton.click();

    const resultElement = await driver.wait(
      until.elementLocated(By.css('.google-result')),
      10000
    );
    const resultText = await resultElement.getText();
    expect(resultText).toContain('Google Safe Browsing Result');
  });
});
