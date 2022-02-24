const { Message, MessageEmbed } = require('discord.js');
const Bot = require('../../../Bot');

module.exports = { 
    name: 'beep',
    usage: 'beep',
    description: 'Boop',
    
    /** 
     * @param {Bot} bot 
     * @param {Message} message 
     */
    run: async (bot, message) => {
        return message.channel.send('Boop')
    }
};