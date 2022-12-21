const { Message } = require('discord.js');
const Bot = require('../../../Bot');

module.exports = {
    eventName: 'messageCreate',
    /**
     * 
     * @param {Bot} bot 
     * @param {Message} message 
     */
    callback: async (bot, message) => {
    if (message.channelId == '733676206943371297') {
        if(message.author == bot) return;
        if (!message.url.includes('tenor.com') && !message.content.includes('tenor.com')) {
            if (message.attachments.size > 0) {
                message.react('👍').then(() => message.react('👎'));
            }
            if (message.content.startsWith('https://')) {
                setTimeout(() => {
                    if (message.embeds.length > 0) {
                        message.react('👍').then(() => message.react('👎'));
                    }
                }, 1.5 * 1000);
            }
        }
    }
}
}