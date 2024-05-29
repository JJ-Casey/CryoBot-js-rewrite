const { ChatInputCommandInteraction, SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const Bot = require('../../../Bot.js');
const { ownerID } = require('../../../config.json');
const colors = require('../../utils/colors.js');
const perms = require('../../utils/perms.js');
const utils = require('../../utils/discordUtils.js')

module.exports = {
    name: 'jail',
    hidden: true,
    permissions: [ ],
    usage: 'jail [user]',
    description: 'Sends the user to the gulag',
    category: 'Mod Commands',

    slash: new SlashCommandBuilder()
        .setName('jail')
        .setDescription('Sends the user to the gulag')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('The user to jail')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),

    /** 
     * @param {Bot} bot 
     * @param {ChatInputCommandInteraction} interaction 
     */
    run: async (bot, interaction) => {
        // Give user jailed role
        // jail 812742522194493440
        // on trial 813938638709719050
    }
};