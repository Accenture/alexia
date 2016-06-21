'use strict';
const alexia = require('..');
const app = alexia.createApp('ResponseObjectExample');

app.intent('SSMLIntent', 'response with ssml', () => {
    return {
        text: '<say-as interpret-as="cardinal">12345</say-as>',
        ssml: true
    };
});

app.intent('CardIntent', 'response with card', () => {
    return {
        text: 'Check out card in alexa app',
        card: {
            title: 'Card title',
            content: 'Card content'
        }
    };
});

app.intent('RepromptIntent', 'response with reprompt', () => {
    return {
        text: 'I should reprompt you in a second',
        reprompt: 'This is a reprompt'
    };
});

app.intent('KeepSessionIntent', 'keep session', () => {
    return {
        text: 'I should terminate this session',
        end: false
    };
});

module.exports = app;