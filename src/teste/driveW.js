const { Client } = require('whatsapp-web.js');
const client = new Client();
// const browser = await puppeteer.launch({headless: false, ignoreDefaultArgs: ["--enable-automation"],});
// await page.keyboard.type('test54')
// await page.evaluate((a, b) => {
//     document.querySelector('#a').select();
// }, a, b);
//
// await page.keyboard.type('China')
// https://github.com/mattnull/node-googlecontacts
client.on('qr', (qr) => {
    // Generate and scan this code with your phone
    console.log('QR RECEIVED', qr);
});

client.on('ready', () => {
    console.log('Client is ready!');
});

client.on('message', msg => {
    if (msg.body == '!ping') {
        msg.reply('pong');
    }
});

client.initialize();
