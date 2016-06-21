'use strict';
const alexia = require('..');
const app = alexia.createApp('SessionAttributesExample');

// Store attribute
app.intent('AttrsIntent', 'My name is {name:Name}', (slots) => {
    return {
        text: `Hi ${slots.name}`,
        attrs: {name: slots.name},
        end: false
    };
});

// Use attribute
app.intent('AttrsIntentTwo', 'What is my name', (_slots, attrs) => {
    if(attrs.name) {
        return `Your name is ${attrs.name}`;
    } else {
        return 'You are no one';
    }
});

// Add another and keep previous attributes
app.intent('AttrsIntentThree', 'I am {age:Number} years old', (slots, attrs) => {
    return {
        text: `Hi ${slots.name}`,
        attrs: Object.assign({}, attrs, {name: slots.age})
    };
});

module.exports = app;