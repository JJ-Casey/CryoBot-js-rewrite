const { BaseInteraction, SlashCommandBuilder } = require('discord.js');
const Bot = require('../../../Bot');

module.exports = { 
    name: 'boop',
    usage: 'boop',
    hidden: false,
    permissions: [],
    description: 'Beep',
    category: 'Standard Commands',
    
    slash: new SlashCommandBuilder().setName('boop').setDescription('Replies with Beep!'),

    /** 
     * @param {Bot} bot 
     * @param {BaseInteraction} interaction 
     */
    run: async (bot, interaction) => {
        return interaction.reply('Beep')
    }
};