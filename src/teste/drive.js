"use strict";

var _require = require("selenium-webdriver"),
  Builder = _require.Builder,
  By = _require.By,
  Key = _require.Key,
  until = _require.until;

let chrome = require('selenium-webdriver/chrome');

var driver = new Builder().forBrowser("chrome").build();

driver
  .get("https://web.whatsapp.com/")
  // .then(_ => driver.findElement(By.name("q")).sendKeys("webdriver", Key.RETURN))
  // .then(_ => driver.wait(until.titleIs("webdriver - Google Search"), 1000))
  .then(_ => {
    //   return driver.quit();
  });


// let chrome = require('selenium-webdriver/chrome');
// let { Builder } = require('selenium-webdriver');
// var driver = new Builder()
// .forBrowser('chrome')
// .setChromeOptions(new chrome.Options().setUserPreferences(
//     { "download.default_directory": task.download_dir }
// ))
// .build();

// ( function example() {
//   var driver =  new Builder().forBrowser('chrome').build();

//   try {
//      driver.get('https://google.com');
//     // await driver.findElement(By.name('q')).sendKeys('webdriver', Key.RETURN);
//     // await driver.wait(until.titleIs('webdriver - Google Search'), 100000000);
//   } finally {
//     // await driver.quit();
//   }
// })();
