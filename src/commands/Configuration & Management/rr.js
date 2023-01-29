const { ChatInputCommandInteraction, ActionRowBuilder, StringSelectMenuBuilder, ButtonBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ButtonStyle, SlashCommandBuilder, formatEmoji, hyperlink } = require('discord.js');
const Bot = require('../../../Bot');
const { ownerID } = require('../../../config.json');
const colors = require('../../utils/colors.js');
const perms = require('../../utils/perms.js');
const utils = require('../../utils/discordUtils.js')

async function createReactionEmbed(bot, group, serverId) {
    return new Promise((resolve, reject) => {
        const query = `SELECT rg.*, rr.* FROM reactionroles AS rr RIGHT JOIN reactiongroups AS rg ON rr.rGroupKEY = rg.rGroupKEY WHERE rg.serverId='${serverId}' AND rg.groupName= ? `;

        bot.database.query(query, [ group ], function (err, results) {
            if (err) { console.error(err.stack); reject(err); }

            const description = results[0]['description'];

            const embed = utils.getDefaultMessageEmbed(bot, { title: group, description: description});

            results.forEach(row => {
                embed.addFields({ name: row['reaction'], value: `<@&${row['roleId']}>`, inline: true});
            });

            let reactions = results.map(row => row['reaction']);

            resolve([ embed, reactions ]);
        });
    });
}

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
        .addSubcommand(subcommand => subcommand.setName('view')
                .setDescription('View information about all reaction groups'))
        .addSubcommand(subcommand => subcommand.setName('create')
                .setDescription('Create a new reaction role group'))
        .addSubcommand(subcommand => subcommand.setName('remove')
                .setDescription('Delete reaction role group'))
        .addSubcommand(subcommand => subcommand.setName('addrole')
                .setDescription('Add a role to a reaction group')
                .addStringOption(option =>
                    option.setName('group')
                        .setDescription('The reaction role group to add the role to')
                        .setRequired(true)
                        .setAutocomplete(true))
                .addMentionableOption(option =>
                    option.setName('role')
                        .setDescription('The role to add')
                        .setRequired(true))
                .addStringOption(option =>
                    option.setName('reaction')
                        .setDescription('The reaction used to get the role')
                        .setRequired(true)))
        .addSubcommand(subcommand => subcommand.setName('remrole')
                .setDescription('Remove a role from a reaction group')
                .addStringOption(option =>
                    option.setName('group')
                        .setDescription('The reaction role group to add the role to')
                        .setRequired(true)
                        .setAutocomplete(true)))
        .addSubcommand(subcommand => subcommand.setName('sendmessage')
                .setDescription('Send the reaction group message to the specified channel')
                .addStringOption(option =>
                    option.setName('group')
                        .setDescription('The reaction role group to set the message of')
                        .setRequired(true)
                        .setAutocomplete(true))
                .addChannelOption(option => 
                    option.setName('channel')
                        .setDescription('The channel to send the reaction message to')
                        .setRequired(true)))
        .addSubcommand(subcommand => subcommand.setName('setmessage')
                .setDescription('Set the message to be used as the reaction group message')
                .addStringOption(option =>
                    option.setName('group')
                        .setDescription('The reaction role group to set the message of')
                        .setRequired(true)
                        .setAutocomplete(true))
                .addStringOption(option => 
                    option.setName('message_link')
                        .setDescription('The link of the message to be set as the reaction message')
                        .setRequired(true))
                ),

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
            case 'view':
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
                                selectMenu.addOptions({ label: row['groupName'], value: row['groupName'] })
                            });
                            selectRow.addComponents(selectMenu);
                            
                            interaction.editReply({ components: [ selectRow ] });
                        });
                    });
                }
            break;
            case 'create':
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
            case 'addrole':
                {
                    const groupName = interaction.options.getString('group');
                    const role = interaction.options.getMentionable('role');
                    const reaction = interaction.options.getString('reaction');

                    embed.setTitle(groupName).setColor(colors.Orange);
                    embed.addFields(
                        { name:`Group`, value: `${groupName}` },
                        { name:`Role`, value: `${role}`, inline:true},
                        { name:`Reaction`, value: `${reaction}`, inline:true}
                        );
                    const row = new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId('rrAcceptAddRole')
                                .setLabel('Correct!')
                                .setStyle(ButtonStyle.Success),
                            new ButtonBuilder()
                                .setCustomId('rrCancelAddRole')
                                .setLabel('Nononononono!')
                                .setStyle(ButtonStyle.Danger),
                        );
                    interaction.reply({ embeds: [embed], components: [row] });
                }
            break;
            case 'remrole':
                {
                    const groupName = interaction.options.getString('group');
                    const role = interaction.options.getMentionable('role');
                    const reaction = interaction.options.getString('reaction');
                    embed.setTitle(groupName).setColor(colors.Orange);
                    embed.addFields(
                        { name:`Group`, value: `${groupName}` },
                        { name:`Role`, value: `${role}`, inline:true},
                        { name:`Reaction`, value: `${reaction}`, inline:true}
                        );
                    const row = new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId('rrAcceptAddRole')
                                .setLabel('Correct!')
                                .setStyle(ButtonStyle.Success),
                            new ButtonBuilder()
                                .setCustomId('rrCancelAddRole')
                                .setLabel('Nononononono!')
                                .setStyle(ButtonStyle.Danger),
                        );
                    interaction.reply({ embeds: [embed], components: [row] });
                }
            break;
            case 'sendmessage':
                try {
                    const groupName = interaction.options.getString('group');
                    const channel = interaction.options.getChannel('channel');
    
                    const temp = await createReactionEmbed(bot, groupName, interaction.guildId);
                    const reactionEmbed = temp[0];
                    const reactions = temp[1];
    
                    if (reactionEmbed == null) {
                        return;
                    }
                    const resp = utils.getDefaultMessageEmbed(bot, { title: "Reaction Message Sent" });
    
                    const message = await channel.send({ embeds: [ reactionEmbed ], fetchReply: true });
    
                    for (let reacc of reactions) {
                        console.log(`emoji: ${reacc}`);
                        await message.react(reacc);
                        console.log('Printed emoji');
                    }
    
                    const urlToMessage = hyperlink('Go to message', message.url);
    
                    resp.setDescription(`The message was sent to ${channel}.\n${urlToMessage}`);
                    interaction.reply({ embeds: [ resp ] });
                } catch (err) {
                    console.error(err.stack)
                }
            break;
            case 'setmessage':
                interaction.reply(':)');
            break;
            }
    }
};