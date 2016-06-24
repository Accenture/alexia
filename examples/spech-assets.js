'use strict';
const alexia = require('..');
const app = alexia.createApp('SpeechAssetsExample');

app.customSlot('Mood', ['fine', 'meh']);

app.intent('WhatsUpIntent', 'I am doing {mood:Mood}', (slots, attrs) => {
    return 'Whatever you say';
});

app.intent('AwesomeIntent', 'You are awesome', (slots, attrs) => {
    return 'Yes';
});

const assets = app.speechAssets();
console.log(speechAssets.toString());

module.exports = app;