const Bot = require('../../Bot');
const chalk = require('chalk');
const { readdirSync } = require('fs');

module.exports = bot => {
    const load = dirs => {
        const events = readdirSync(`./src/events/${dirs}/`).filter(d => d.endsWith('.js'));
        for (let file of events) {
            const evt = require(`../events/${dirs}/${file}`);
            bot.on(evt.eventName, evt.callback.bind(null, bot));
        }
    };
    ['errors'].forEach(x => load(x));
};