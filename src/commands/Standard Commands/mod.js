const { ChatInputCommandInteraction, SlashCommandBuilder } = require('discord.js');
const Bot = require('../../../Bot');
const { Random } = require("random-js");
const utils = require('../../utils/discordUtils.js')

mods = ['Nosp', 'Mitzy', 'Noah', 'Lens'];

/**
 * If light is picked, edit the message after a few seconds and choose someone else
 */
module.exports = { 
    name: 'mod',
    aliases: ['BestMod', 'bestMod', 'bestmod', 'mods'],
    hidden: false,
    permissions: [],
    usage: 'mod',
    description: 'Displays who is the best moderator',
    category: 'Standard Commands',
    
    slash: new SlashCommandBuilder()
        .setName('mod')
        .setDescription('Displays the best mod'),

    /** 
     * @param {Bot} bot 
     * @param {ChatInputCommandInteraction} interaction 
     */
    run: async (bot, interaction) => {
        const embed = utils.getDefaultMessageEmbed(bot, {title:'Best Mod'}).setDescription(`🙌 ${new Random().pick(mods)} is best mod 🙌`)
        return interaction.reply({embeds:[embed]});
    }
};