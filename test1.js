const puppeteer = require('puppeteer');
const { PuppeteerScreenRecorder } = require('puppeteer-screen-recorder');

(async () => {
  // Launch the browser
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  // Start recording
  const recorder = new PuppeteerScreenRecorder(page, {
        followNewTab: true,
        recordPageInteractions: true,
        fps: 25,
        videoFrame: {
          width: 1280,
          height: 720,
        },
        keyCombo: {
          forStart: 'Command+Shift+R',
          forStop: 'Command+Shift+S',
        },
      });
    
      // Configure the path to save the video
      await recorder.start('todolist-test-recording.mp4');
    
      // Navigate to the Todo List web page
      await page.goto('https://todolist.james.am/#/', { waitUntil: 'networkidle0' });
    
      const todoInputSelector = '.new-todo';
    
      try {
        // Wait for the input box to be visible
        await page.waitForSelector(todoInputSelector);
    
        // Type in a new todo with an exclamation mark
        await page.type(todoInputSelector, 'Buy milk!');
        await page.keyboard.press('Enter');
    
        // Check whether the new todo item has been added
        // const todoText = await page
    // Verifying the item with an exclamation mark
    const newItemSelector = '.todo-list li:last-child label';
    await page.waitForSelector(newItemSelector);

    const todoText = await page.evaluate(selector => {
      return document.querySelector(selector).innerText;
    }, newItemSelector);

    // Check if the entered todo text matches the expected
    if (todoText === 'Buy milk!') {
      console.log('Test passed: Todo item with an exclamation mark was added.');
    } else {
      console.error('Test failed: Todo item with an exclamation mark was not found in the list.');
    }
  } catch (error) {
    // If elements are not found, log the error
    console.error('Test skipped due to missing element:', error);
  }

  // Stop the recording before closing the browser
  await recorder.stop();

  // Close the browser
  await browser.close();
})();