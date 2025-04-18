const { Builder, By, until } = require('selenium-webdriver');

(async function secureLinkTest() {
  const driver = await new Builder().forBrowser('chrome').build();

  try {
    // STEP 1: Visit the app
    await driver.get('http://localhost:3000');

    // FIRST TEST: Safe URL 
    console.log('Testing with http://google.com');

    const urlInput1 = await driver.findElement(By.id('urlInput'));
    await urlInput1.clear();
    await urlInput1.sendKeys('http://google.com');

    const checkButton1 = await driver.findElement(By.id('checkButton'));
    await checkButton1.click();

    await driver.wait(until.elementLocated(By.id('googleResult')), 10000);
    const googleResult1 = await driver.findElement(By.id('googleResult'));
    const resultText1 = await googleResult1.getText();
    console.log('Google Safe Browsing Result:\n', resultText1);

    const mlButton1 = await driver.findElement(By.id('mlCheckButton'));
    await mlButton1.click();

    await driver.wait(until.elementLocated(By.id('mlResult')), 10000);
    const mlResult1 = await driver.findElement(By.id('mlResult'));
    const mlText1 = await mlResult1.getText();
    console.log('ML Model Result:\n', mlText1);

    // REFRESH THE APP 
    await driver.navigate().refresh();
    await driver.wait(until.elementLocated(By.id('urlInput')), 5000);

    // SECOND TEST: Phishing URL 
    console.log('Testing with phishing link www.customs.ie-charge.info');

    const urlInput2 = await driver.findElement(By.id('urlInput'));
    await urlInput2.clear();
    await urlInput2.sendKeys('www.customs.ie-charge.info');

    const checkButton2 = await driver.findElement(By.id('checkButton'));
    await checkButton2.click();

    await driver.wait(until.elementLocated(By.id('googleResult')), 10000);
    const googleResult2 = await driver.findElement(By.id('googleResult'));
    const resultText2 = await googleResult2.getText();
    console.log('Google Safe Browsing Result:\n', resultText2);

    const mlButton2 = await driver.findElement(By.id('mlCheckButton'));
    await mlButton2.click();

    await driver.wait(until.elementLocated(By.id('mlResult')), 10000);
    const mlResult2 = await driver.findElement(By.id('mlResult'));
    const mlText2 = await mlResult2.getText();
    console.log('ML Model Result:\n', mlText2);

  } catch (err) {
    console.error('Test failed:', err);
  } finally {
    await driver.quit();
  }
})();
