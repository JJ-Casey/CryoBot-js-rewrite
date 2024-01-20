const { ChatInputCommandInteraction, SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const Bot = require('../../../Bot');
const { ownerID } = require('../../../config.json');
const colors = require('../../utils/colors.js');
const perms = require('../../utils/perms.js');
const utils = require('../../utils/discordUtils.js')

module.exports = {
    name: 'purgeUser',
    hidden: true,
    permissions: [],
    usage: 'purgeUser',
    description: 'Deletes a User\'s messages from the current channel',
    category: 'Mod Commands',

    slash: new SlashCommandBuilder()
        .setName('purge-user')
        .setDescription('Deletes a User\'s messages from the current channel')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('The User to purge')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

    /** 
     * @param {Bot} bot 
     * @param {ChatInputCommandInteraction} interaction 
     */
    run: async (bot, interaction) => {
        const target = interaction.options.getUser('target');

        interaction.channel.messages.fetch()
            .then(messages => {
                const filtered_messages = messages.filter(m => m.author.id === target.id);
                interaction.reply({ content: `Deleting ${filtered_messages.size} messages sent by ${target}`, ephemeral: true });
                // filtered_messages.forEach(msg => msg.delete());
            })
            .catch(console.error);
    }
};