const { Message, MessageEmbed } = require('discord.js');
const Bot = require('../../../Bot');

module.exports = { 
    name: 'boop',
    usage: 'boop',
    description: 'Beep',
    
    /** 
     * @param {Bot} bot 
     * @param {Message} message 
     */
    run: async (bot, message) => {
        return message.channel.send('Beep')
    }
};