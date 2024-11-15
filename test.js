const puppeteer = require('puppeteer');
const { PuppeteerScreenRecorder } = require('puppeteer-screen-recorder');

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  const recorder = new PuppeteerScreenRecorder(page);
  await page.setViewport({ width: 1280, height:720 })
  await page.goto('https://todolist.james.am/#/')

  await recorder.start("./video_path.mp4");

  const inputSelector = '.new-todo';
  await page.waitForSelector(inputSelector);

  await page.focus(inputSelector);
  await page.keyboard.type('reminder to test edge cases');
  await page.keyboard.press("Enter");

  await page.focus(inputSelector);
  await page.keyboard.type('reminder to add test cases');
  await page.keyboard.press("Enter");

  await page.focus(inputSelector);
  await page.keyboard.type('reminder to log bugs');
  await page.keyboard.press("Enter");

  // this will wait for 3 seconds
  await page.waitForTimeout(3000);

  await recorder.stop();

  await browser.close();
})();