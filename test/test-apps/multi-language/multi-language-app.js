'use strict';
const i18next = require('i18next');
const FilesystemBackend = require('i18next-node-fs-backend');
const alexia = require('../../..');

const app = alexia.createApp();

// Initialize i18next internationalization
i18next
  .use(FilesystemBackend)
  .init({
    // debug: true,
    lng: 'en',
    fallbackLng: 'en',
    backend: {
      loadPath: 'test/test-apps/multi-language/locales/{{lng}}/{{ns}}.json'
    },
    preload: ['en', 'de'],
    ns: ['translation', 'custom-slots']
  });

// Pass i18 to alexia app to make it available for requests and speech assets generation
app.setI18next(i18next);

app.onStart(() => {
  return app.t('text');
});

app.intent('LocalizedIntent', () => {
  return app.t('text');
});

app.intent('IntentWithoutLocalization', () => {
  return 'Hi, this intent does not have any utterances nor locale translation.';
  // So utterances won't be generated
});

app.intent('LocalizedSlotIntent', (slots) => {
  return app.t('text', slots);
});

app.intent('yes', () => {
  return app.t('text');
});

app.builtInIntent('help', () => {
  return app.t('text');
});

module.exports = app;
