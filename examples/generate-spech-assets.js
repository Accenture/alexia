'use strict';
const alexia = require('..');
const app = alexia.createApp('GenerateSpeechAssetsExample');

app.customSlot('Mood', ['fine', 'meh']);

app.intent('WhatsUpIntent', 'I am doing {mood:Mood}', (slots, attrs) => {
    return 'Whatever you say';
});

app.intent('AwesomeIntent', 'You are awesome', (slots, attrs) => {
    return 'Yes';
});

const assets = app.generateSpeechAssets();

console.log(assets.intentSchema);
console.log(assets.sampleUtterances);
console.log(assets.customSlotSamples);

module.exports = app;