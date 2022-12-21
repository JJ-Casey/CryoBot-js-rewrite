const Bot = require('../../Bot');
const { readdirSync } = require('fs');

module.exports = bot => {
    return;
    const timers = readdirSync('./src/timers').filter(file => file.endsWith('.js'));
    for (let timer of timers) {
        bot.timers.set(timer.split('.')[0], require(`../timers/${timer}`));
    }
};