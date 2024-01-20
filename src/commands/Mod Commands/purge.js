const { ChatInputCommandInteraction, SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const Bot = require('../../../Bot');
const { ownerID } = require('../../../config.json');
const colors = require('../../utils/colors.js');
const perms = require('../../utils/perms.js');
const utils = require('../../utils/discordUtils.js')

module.exports = {
    name: 'purge',
    hidden: true,
    permissions: [],
    usage: 'purge',
    description: 'Deletes messages from the current channel',
    category: 'Mod Commands',

    slash: new SlashCommandBuilder()
        .setName('purge')
        .setDescription('Delete messages from the current channel')
        .addIntegerOption(option =>
            option.setName('number')
                .setDescription('The number of messages to delete')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

    /** 
     * @param {Bot} bot 
     * @param {ChatInputCommandInteraction} interaction 
     */
    run: async (bot, interaction) => {
        let num_to_delete = interaction.options.getInteger('number') ?? 5;

        interaction.channel.bulkDelete(num_to_delete).then(messages => {
            interaction.reply({ content: `Deleted ${messages.size} messages!`, ephemeral: true })
        }).catch(console.err);
    }
};