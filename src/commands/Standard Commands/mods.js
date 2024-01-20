const { ChatInputCommandInteraction, SlashCommandBuilder } = require('discord.js');
const Bot = require('../../../Bot');

mitzy_id = '398957705294774272';

module.exports = { 
    name: 'mods',
    hidden: false,
    permissions: [],
    description: 'Mods plz',
    usage: 'mods',
    category: 'Standard Commands',

    slash: new SlashCommandBuilder()
        .setName('mods')
        .setDescription('Mods plz'),

    /** 
     * @param {Bot} bot 
     * @param {ChatInputCommandInteraction} interaction 
     */
    run: async (bot, interaction) => {
        // return message.channel.send('bababooey');
        // if (interaction.member.id == mitzy_id) {
        //     if (message.content.slice(3) === 'Mods') {
        //         return interaction.reply('Silly Mitzy. Learn how to type smh');
        //     }
        // }
        return interaction.reply('M<:OMEGALUL:739145494890283089>DS');
    }
};