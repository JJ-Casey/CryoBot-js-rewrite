const { Message, MessageEmbed } = require('discord.js');
const Bot = require('../../../Bot');

mitzy_id = '398957705294774272';

module.exports = { 
    name: 'mods',
    usage: 'mods',
    description: 'Mods plz',
    
    /** 
     * @param {Bot} bot 
     * @param {Message} message 
     */
    run: async (bot, message) => {
        if (message.author.id == mitzy_id) {
            if (message.content.slice(3) === 'Mods') {
                return message.channel.send('Silly Mitzy. Learn how to type smh');
            }
        }
        return message.channel.send('M<:OMEGALUL:739145494890283089>DS');
    }
};