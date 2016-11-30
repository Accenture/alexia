'use strict';
const i18next = require('i18next');
const FilesystemBackend = require('i18next-node-fs-backend');
const alexia = require('../..');

const app = alexia.createApp();

// Initialize i18next internationalization
i18next
  .use(FilesystemBackend)
  .init({
    // debug: true,
    lng: 'en',
    fallbackLng: 'en',
    backend: {
      loadPath: 'locales/{{lng}}/{{ns}}.json' // Path is relative to your current working directory - change it accordingly
    },
    preload: ['en', 'de'],
    ns: ['translation', 'custom-slots']
  });

// Pass i18 to alexia app to make it available for requests and speech assets generation
app.setI18next(i18next);

app.onStart(() => {
  return app.t('text');
});

app.onEnd(() => {
  return app.t('text');
});

app.intent('LocalizedIntent', slots => {
  return app.t('text', slots);
});

app.builtInIntent('yes', () => {
  return app.t('text');
});

module.exports = app;
