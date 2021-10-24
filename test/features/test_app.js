// ref: https://mochajs.org/
import assert from "assert"
// ref: https://www.npmjs.com/package/selenium-webdriver
import {Builder, By, Key, until} from "selenium-webdriver"

describe('testPlayButtonAndSliderMove', function() {
  it('Should push play button and check that slider moves', async function() {
    this.timeout(5000);
    let result = await (async function testPlayButtonAndSliderMove() {
      let driver = await new Builder().forBrowser("safari").build();
      try {
        await driver.get("http://127.0.0.1:8080/audio");
        await driver.wait(until.titleIs("Audio"));
        let play = await driver.wait(
          until.elementIsVisible(
            driver.findElement(By.id("play"))
          ),
          3000
        );
        // Note: The Safari webdriver seems to have an issue where using a
        // regular click() type of method ends up with a "not interactable"
        // error.
        // ref: https://pythonbasics.org/selenium-execute-javascript/
        // ref: https://stackoverflow.com/a/11956130/1167750
        // ref: https://developer.apple.com/forums/thread/123685
        await driver.wait(driver.executeScript('arguments[0].click();', play));
        // ref: https://www.selenium.dev/selenium/docs/api/javascript/module
        //   /selenium-webdriver/lib/until.html
        await driver.wait(function() {
          let aps = driver.findElement(By.id("audioPlayerSlider"));
          // ref: https://developer.mozilla.org/en-US/docs/Web/JavaScript
          // /Reference/Global_Objects/Promise
          // ref: https://stackoverflow.com/a/40557587/1167750
          return aps.getAttribute("value")
            .then(value => {
              if (value > 0) {
                return true;
              }
            })
            .catch(err => {
              console.log(err);
            });
        }, 3000);
      } catch(err) {
        console.log(err);
      } finally {
        await driver.quit();
      }
    })();

    // #TODO: This isn't quite working, yet
    await result.then(value => {
    console.log(value);
      assert.equal(value, true);
    });
  });
});
