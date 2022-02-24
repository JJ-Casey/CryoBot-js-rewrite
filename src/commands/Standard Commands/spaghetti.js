const { Message, MessageEmbed } = require('discord.js');
const Bot = require('../../../Bot');

module.exports = { 
    name: 'spaghetti',
    usage: 'spaghetti',
    description: 'Shame JJ for CryoBot having Spaghetti code',
    
    /** 
     * @param {Bot} bot 
     * @param {Message} message 
     */
    run: async (bot, message) => {
        let curr_val = 0;
        return message.channel.send(`${bot.user.username} has had ${curr_val} instances of spaghetti code!`)
    }
};