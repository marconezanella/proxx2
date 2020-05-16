'use strict';

var sulla = require('sulla');

sulla.create().then(function (client) {
  return start(client);
});

function start(client) {
  client.onMessage(function (message) {
    if (message.body === 'Hi') {
      client.sendText(message.from, '👋 Hello from sulla!');
    }
  });
}