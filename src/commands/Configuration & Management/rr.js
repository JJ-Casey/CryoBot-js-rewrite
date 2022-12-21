const { ChatInputCommandInteraction, ActionRowBuilder, StringSelectMenuBuilder, ButtonBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ButtonStyle, SlashCommandBuilder } = require('discord.js');
const mysql = require('mysql')
const Bot = require('../../../Bot');
const { ownerID } = require('../../../config.json');
const colors = require('../../utils/colors.js');
const perms = require('../../utils/perms.js');
const utils = require('../../utils/discordUtils.js')

module.exports = {
    name: 'rr',
    hidden: true,
    permissions : [ perms.checkIsOwner() ],
    usage: 'rr (subcommand) (options)',
    description: 'Reaction Role Stuff',
    category: 'Configuration & Management',
    
    slash: new SlashCommandBuilder()
        .setName('rr')
        .setDescription('Reaction role stuff')
        .addSubcommand(subcommand =>
            subcommand.setName('list')
            .setDescription('View all the reaction role groups currently set up'))
        .addSubcommand(subcommand =>
            subcommand.setName('view')
            .setDescription('View a particular reaction group'))
        .addSubcommand(subcommand =>
            subcommand.setName('create')
            .setDescription('Create a new reaction role group'))
        .addSubcommand(subcommand =>
            subcommand.setName('remove')
            .setDescription('Delete reaction role group')),

    /** 
     * @param {Bot} bot 
     * @param {ChatInputCommandInteraction} interaction 
     */
    run: async(bot, interaction) => {
        if (interaction.member.id !== ownerID) {
            return;
        }

        const embed = utils.getDefaultMessageEmbed(bot, { title:'Reaction Roles' });

        switch (interaction.options.getSubcommand()) {
            case 'list':
                {
                    embed.setDescription('Here are all of the reaction groups you have set up!');
                    interaction.reply({ embeds: [embed], fetchReply: true}).then(reply => {
                        const query = `SELECT * FROM reactiongroups WHERE serverId=${interaction.guildId}`;
                        bot.database.query(query, function (err, result) {
                            if (err) {
                                return interaction.reply({ embeds: [
                                    utils.getDefaultMessageEmbed(bot, {title:'Error', color: colors.Red})
                                        .setDescription(`${err}`)
                                        .addField('Query', `Parsed query: ${query}`)
                                    ] });
                            }
                    
                            result.forEach(row => {
                                let value = '';
                                for (let key in row) {
                                    if (key === 'groupName') {
                                        continue;
                                    } 
                                    value += `**${key}**: ${row[key]}\n`;
                                }
                                embed.addFields({ name: row['groupName'], value: value });
                            });
                            interaction.editReply({ embeds: [ embed ] });
                        });
                    });
                }
            break;
            case 'view':
                // view a specific reaction group
                {
                    embed.setDescription('View Reaction Group information');
                    embed.addFields({name:'No group selected', value: 'Select a group to view information about it!'});
                    interaction.reply({ embeds: [embed], fetchReply:true}).then(reply => {
                        const query = `SELECT groupName FROM reactiongroups WHERE serverId=${interaction.guildId}`;
                        bot.database.query(query, function (err, result) {
                            if (err) {
                                return interaction.reply({ embeds: [
                                    utils.getDefaultMessageEmbed(bot, {title:'Error', color: colors.Red})
                                        .setDescription(`${err}`)
                                        .addFields({ name: 'Query', value: `Parsed query: ${query}` })
                                    ] });
                            }
                    
                            const selectRow = new ActionRowBuilder();
                            const selectMenu = new StringSelectMenuBuilder()
                                .setCustomId('rrGroupView')
                                .setPlaceholder('Nothing selected');
                            
                            result.forEach(row => {
                                selectMenu.addOptions({ label:row['groupName'], value: row['groupName'] })
                            });
                            selectRow.addComponents(selectMenu);
                            
                            const buttonRow = new ActionRowBuilder();
                            const addRoleButton = new ButtonBuilder()
                                .setCustomId('rrAddRole')
                                .setName('Add Role')
                                .setStyle(ButtonStyle.Success);
                            const removeRoleButton = new ButtonBuilder()
                                .setCustomId('rrRemoveRole')
                                .setName('Remove Role')
                                .setStyle(ButtonStyle.Danger);
                            buttonRow.addComponents(addRoleButton, removeRoleButton)

                            interaction.editReply({ components: [ selectRow ] });
                        });
                    });
                }
            break;
            case 'fix':
                interaction.reply('Fixing...');
                bot.database.query(`DELETE FROM reactionroles WHERE groupName='948297226537553960'`);
                bot.database.query(`SELECT * FROM reactiongroups`, function (err1, rGroups) {
                    if (err1) { interaction.editReply({ embeds: [utils.getDefaultMessageEmbed(bot, { title: 'Error', color: colors.Red }).setDescription(`${err1}`)] }); }
                    rGroups.forEach(rowGroup => {
                        console.log(rowGroup);
                        const groupName = rowGroup['groupName'];
                        const messageId = rowGroup['messageId'];
                        bot.database.query(`UPDATE reactionroles SET groupName='${groupName}' WHERE groupName='${messageId}'`, function (err1, rGroups) {
                            if (err1) { interaction.editReply({ embeds: [utils.getDefaultMessageEmbed(bot, { title: 'Error', color: colors.Red }).setDescription(`${err1}`)] }); }
                        });
                    });
                });
            break;
            // Some other command:
            // Choose Role
            // Choose Reacc
            // Add More? (Yes, No, Finish)
            // Choose Message, Send new message, finish
            // If choose message: Give message id
            // If send new message, which channel?
            case 'create':
                // Add this to "/rr view"
                const modal = new ModalBuilder()
                    .setCustomId('rrCreateReactionGroup')
                    .setTitle('Create Reaction Group');

                const groupNameInput = new TextInputBuilder()
                    .setCustomId('groupName')
                    .setMinLength(1)
                    .setMaxLength(40)
                    .setLabel("Enter the name of the group to create")
                    .setStyle(TextInputStyle.Short);

                const groupDescInput = new TextInputBuilder()
                    .setCustomId('groupDesc')
                    .setMinLength(1)
                    .setMaxLength(200)
                    .setLabel("Enter the description of the group")
                    .setStyle(TextInputStyle.Paragraph);

                const groupNameRow = new ActionRowBuilder().addComponents(groupNameInput);
                const groupDescRow = new ActionRowBuilder().addComponents(groupDescInput);

                modal.addComponents(groupNameRow, groupDescRow);

                interaction.showModal(modal);
            break;
            case 'remove':
                {
                    embed.setDescription('Choose a group to remove\n**Selecting an option will immediately delete it! Be Careful!**')
                        .setColor(colors.Red);
                    interaction.reply({ embeds: [embed], fetchReply:true}).then(reply => {
                        const query = `SELECT groupName FROM reactiongroups WHERE serverId=${interaction.guildId}`;
                        bot.database.query(query, function (err, result) {
                            if (err) {
                                return interaction.reply({ embeds: [
                                    utils.getDefaultMessageEmbed(bot, {title:'Error', color: colors.Red})
                                        .setDescription(`${err}`)
                                        .addFields({ name: 'Query', value: `Parsed query: ${query}` })
                                    ] });
                            }
                    
                            const selectRow = new ActionRowBuilder();
                            const selectMenu = new StringSelectMenuBuilder()
                                .setCustomId('rrGroupDelete')
                                .setPlaceholder('Nothing selected');
                            
                            result.forEach(row => {
                                selectMenu.addOptions({ label:row['groupName'], value: row['groupName'] })
                            });
                            selectRow.addComponents(selectMenu);

                            interaction.editReply({ components: [ selectRow ] });
                        });
                    });
                }
            break;
        }

        const subcommand = '';
        switch (subcommand) {
            case 'add':
                const groupName = args.join(' ');
                embed.setColor(colors.Orange).setDescription('Confirm group information');
                embed.addField('Suggested group name', groupName);
                const row = new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                        .setCustomId('rrCorrect')
                        .setLabel('Correct')
                        .setStyle(ButtonStyle.Success),
                    new ButtonBuilder()
                        .setCustomId('rrIncorrect')
                        .setLabel('Incorrect')
                        .setStyle(ButtonStyle.Secondary),
                );
                message.reply({ embeds: [ embed ], components: [ row ] });
            break;
            case 'remove':
            case 'rem':
                {
                    const groupName = args.join(' ');
                    embed.setColor(colors.Orange).setDescription('Confirm group removal');
                    embed.addField('Group to be deleted', groupName);
                    const row = new ActionRowBuilder().addComponents(
                        new ButtonBuilder()
                            .setCustomId('rrRemove')
                            .setLabel('Remove')
                            .setStyle(ButtonStyle.Danger),
                        new ButtonBuilder()
                            .setCustomId('rrKeep')
                            .setLabel('Don\'t Remove')
                            .setStyle(ButtonStyle.Secondary),
                    );
                    message.reply({ embeds: [ embed ], components: [ row ] });
                }
            break;
        }
    }
};