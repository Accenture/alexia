// short app for testing action's transitions saved in arrays
'use strict';
const alexia = require('../..');
const app = alexia.createApp('ContactsApp');

app.intent('OpenContactList', 'Open contact list', () => {
  return 'You can list your contacts, add new one or change already saved ones.'
});

app.intent('NewContact', 'Create new contact', () => {
  return 'Please insert value for name or phone number of contact.';
});

app.intent('ChangeContact', 'Change name for Glogo contact', () => {
  return 'Please insert new value for name or phone number.';
});

app.intent('SetName', 'Set name to Misyak', () => {
  return 'Name was saved.';
});

app.intent('SetNumber', 'Set number to {number:NUMBER}', () => {
  return 'Number was saved.';
});

app.intent('CloseContactList', 'Close contact list', () => {
  return 'See you next time.'
});

app.action({
  from: 'OpenContactList',
  to: ['NewContact','ChangeContact']
});

app.action({
  from: ['NewContact','ChangeContact'],
  to: ['SetName','SetNumber']
});

app.action({
  from: ['NewContact','ChangeContact','SetName','SetNumber'],
  to: 'CloseContactList'
});

module.exports = app;