const { ChatInputCommandInteraction, SlashCommandBuilder } = require('discord.js');
const Bot = require('../../../Bot');

mitzy_id = '398957705294774272';

module.exports = { 
    name: 'mods',
    usage: 'mods',
    hidden: false,
    permissions: [],
    description: 'Mods plz',
    category: 'Standard Commands',

    /** 
     * @param {Bot} bot 
     * @param {ChatInputCommandInteraction} interaction 
     */
    run: async (bot, message) => {
        // return message.channel.send('bababooey');
        if (interaction.member.id == mitzy_id) {
            if (message.content.slice(3) === 'Mods') {
                return message.reply('Silly Mitzy. Learn how to type smh');
            }
        }
        return message.reply('M<:OMEGALUL:739145494890283089>DS');
    }
};