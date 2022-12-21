const { ChatInputCommandInteraction, SlashCommandBuilder } = require('discord.js');
const Bot = require('../../../Bot');

module.exports = { 
    name: 'beep',
    usage: 'beep',
    hidden: false,
    permissions: [],
    description: 'Boop',
    category: 'Standard Commands',

    slash: new SlashCommandBuilder()
        .setName('beep')
        .setDescription('Replies with Boop!'),
    
    /** 
     * @param {Bot} bot 
     * @param {ChatInputCommandInteraction} interaction 
     */
    run: async (bot, interaction) => {
        interaction.reply('Boop');
    }
};