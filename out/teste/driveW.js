'use strict';

var _require = require('whatsapp-web.js');

var Client = _require.Client;

var client = new Client();
// const browser = await puppeteer.launch({headless: false, ignoreDefaultArgs: ["--enable-automation"],});
// await page.keyboard.type('test54')
// await page.evaluate((a, b) => {
//     document.querySelector('#a').select();
// }, a, b);
//
// await page.keyboard.type('China')
// https://github.com/mattnull/node-googlecontacts
client.on('qr', function (qr) {
    // Generate and scan this code with your phone
    console.log('QR RECEIVED', qr);
});

client.on('ready', function () {
    console.log('Client is ready!');
});

client.on('message', function (msg) {
    if (msg.body == '!ping') {
        msg.reply('pong');
    }
});

client.initialize();