'use strict';
const alexia = require('..');
const app = alexia.createApp('SpeechAssetsExample');

app.customSlot('Mood', ['fine', 'meh']);

app.intent('WhatsUpIntent', 'I am doing {mood:Mood}', () => {
    return 'Whatever you say';
});

app.intent('AwesomeIntent', 'You are awesome', () => {
    return 'Yes';
});

const speechAssets = app.speechAssets();
console.log(speechAssets.toString());

module.exports = app;
