const { Builder, By, until } = require('selenium-webdriver');
const fs = require('fs');
const path = require('path');

// Ensure Screenshots directory exists
const screenshotsDir = path.join(__dirname, '../Screenshots');
if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir);
}

(async function secureLinkTest() {
  const driver = await new Builder().forBrowser('chrome').build();

  try {
    // STEP 1: Visit the app//TODO: ********Change to app URL ONCE HOSTED ********
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

    await driver.takeScreenshot().then((data) => {
      fs.writeFileSync(path.join(screenshotsDir, 'safe_test.png'), data, 'base64');
    });

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

    await driver.takeScreenshot().then((data) => {
      fs.writeFileSync(path.join(screenshotsDir, 'phishing_test.png'), data, 'base64');
    });

    // REFRESH THE APP 
    await driver.navigate().refresh();
    await driver.wait(until.elementLocated(By.id('urlInput')), 5000);

    // THIRD TEST: Empty input check 
    console.log('Testing with empty input');

    const mlButton3 = await driver.findElement(By.id('mlCheckButton'));
    await mlButton3.click();

    await driver.wait(until.elementLocated(By.className('error')), 5000);
    const errorMsg = await driver.findElement(By.className('error')).getText();
    console.log('Error Message:\n', errorMsg);

    await driver.takeScreenshot().then((data) => {
      fs.writeFileSync(path.join(screenshotsDir, 'empty_input_error.png'), data, 'base64');
    });

    // ROUTING CHECK: View URLDatabase page
    console.log('Routing to /URLDatabase');
    await driver.get('http://localhost:3000/URLDatabase');
    await driver.wait(until.elementLocated(By.tagName('h1')), 5000);
    const dbHeader = await driver.findElement(By.tagName('h1')).getText();
    console.log('/URLDatabase page loaded with header:', dbHeader);

    await driver.takeScreenshot().then((data) => {
      fs.writeFileSync(path.join(screenshotsDir, 'url_database_page.png'), data, 'base64');
    });

    // ROUTING CHECK: View Contact page
    console.log('Routing to /contact');
    await driver.get('http://localhost:3000/contact');
    await driver.wait(until.elementLocated(By.tagName('h1')), 5000);
    const contactHeader = await driver.findElement(By.tagName('h1')).getText();
    console.log('/contact page loaded with header:', contactHeader);

    await driver.takeScreenshot().then((data) => {
      fs.writeFileSync(path.join(screenshotsDir, 'contact_page.png'), data, 'base64');
    });

  } catch (err) {
    console.error('Test failed:', err);
  } finally {
    await driver.quit();
  }
})();
