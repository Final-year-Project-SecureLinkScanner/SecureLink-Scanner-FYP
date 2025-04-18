const { Builder, By, until } = require('selenium-webdriver');

(async function secureLinkTest() {
  const driver = await new Builder().forBrowser('chrome').build();

  try {
    await driver.get('http://localhost:3000');

    // STEP 1: Fill the input
    const urlInput = await driver.findElement(By.id('urlInput'));
    await urlInput.clear();
    await urlInput.sendKeys('http://google.com');

    // STEP 2: Google Safe Browsing check
    const checkButton = await driver.findElement(By.id('checkButton'));
    await checkButton.click();

    await driver.wait(until.elementLocated(By.id('googleResult')), 10000);
    const googleResult = await driver.findElement(By.id('googleResult'));
    const resultText = await googleResult.getText();
    console.log('✅ Google Safe Browsing Result:\n', resultText);

    // STEP 3: Click ML model checker
    const mlButton = await driver.findElement(By.id('mlCheckButton'));
    await mlButton.click();

    // STEP 4: Wait for ML result
    await driver.wait(until.elementLocated(By.id('mlResult')), 10000);
    const mlResult = await driver.findElement(By.id('mlResult'));
    const mlText = await mlResult.getText();
    console.log('ML Model Result:\n', mlText);

  } catch (err) {
    console.error('Test failed:', err);
  } finally {
    await driver.quit();
  }
})();
