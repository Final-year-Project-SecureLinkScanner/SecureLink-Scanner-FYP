const { Builder, By, until } = require('selenium-webdriver');

(async function secureLinkTest() {
  const driver = await new Builder().forBrowser('chrome').build();

  try {
    await driver.get('http://localhost:3000');

    const urlInput = await driver.findElement(By.id('urlInput'));
    await urlInput.sendKeys('http://example.com');

    const checkButton = await driver.findElement(By.id('checkButton'));
    await checkButton.click();

    await driver.wait(until.elementLocated(By.id('googleResult')), 10000);
    const googleResult = await driver.findElement(By.id('googleResult'));
    const resultText = await googleResult.getText();
    console.log('Google Safe Browsing:', resultText);

  } catch (err) {
    console.error('Test failed:', err);
  } finally {
    await driver.quit();
  }
})();
