const { ChatInputCommandInteraction, ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder } = require('discord.js');
const Bot = require('../../../Bot');
const colors = require('../../utils/colors.js');
const utils = require('../../utils/discordUtils.js');
const perms = require('../../utils/perms');

module.exports = { 
    name: 'addPermission',
    hidden: true,
    permissions: [ perms.checkIsAdministrator() ],
    usage: 'addPermission',
    description: 'Adds a role or User to the permissions of a command',
    category: 'Configuration & Management',

    slash: new SlashCommandBuilder()
        .setName('add-permission')
        .setDescription('Adds a role or User to the permissions of a command')
        .addSubcommand(subcommand =>
            subcommand.setName('role')
                .setDescription('Set the permission for a role')
                .addStringOption(option =>
                    option.setName('command')
                        .setDescription('The command to set permissions of')
                        .setRequired(true)
                        .setAutocomplete(true))
                .addRoleOption(option =>
                    option.setName('target_role')
                    .setDescription('The role')
                    .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand.setName('user')
                .setDescription('Set the permission for a User')
                .addStringOption(option =>
                    option.setName('command')
                        .setDescription('The command to set permissions of')
                        .setRequired(true)
                        .setAutocomplete(true))
                .addUserOption(option =>
                    option.setName('target_user')
                    .setDescription('The User')
                    .setRequired(true))
                    ),
    
    /** 
     * @param {Bot} bot 
     * @param {ChatInputCommandInteraction} interaction 
     */
    run: async (bot, interaction) => {
        const commandName = interaction.options.getString('command');
        const role = interaction.options.getRole('target_role');
        const user = interaction.options.getUser('target_user');

        const embed = utils.getDefaultMessageEmbed(bot)
            .setTitle('Add Permissions')
            .addFields(
                { name:'Command', value: `${commandName}` }
                );
        if (interaction.options.getSubcommand() == 'role') {
            embed.addFields({ name: 'Role to give Permission', value: `${role}` });
        } else {
            embed.addFields({ name: 'User to give Permission', value: `${user}` });
        }
        embed.addFields({ name: utils.emptyEmbed, value: 'Are you sure?' });

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(`permConfirm-${interaction.member.id}`)
                    .setLabel('Yes')
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setCustomId(`permDeny-${interaction.member.id}`)
                    .setLabel('No')
                    .setStyle(ButtonStyle.Danger),
            );
        interaction.reply({ embeds: [embed], components: [row], ephemeral: true });
    }
};