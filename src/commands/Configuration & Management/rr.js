const { ChatInputCommandInteraction, ActionRowBuilder, StringSelectMenuBuilder, ButtonBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ButtonStyle, SlashCommandBuilder, formatEmoji, hyperlink } = require('discord.js');
const Bot = require('../../../Bot');
const { ownerID } = require('../../../config.json');
const colors = require('../../utils/colors.js');
const perms = require('../../utils/perms.js');
const utils = require('../../utils/discordUtils.js')

async function createReactionEmbed(bot, group, serverId) {
    return new Promise((resolve, reject) => {
        const query = `SELECT * FROM reactionGR WHERE serverId='${serverId}' AND groupName= ? `;

        bot.database.query(query, [group], function (err, results) {
            if (err) {
                utils.raiseError(bot, err);
                reject(err);
            }

            const description = results[0]['description'];

            const embed = utils.getDefaultMessageEmbed(bot, { title: group, description: description });

            const filteredResults = results.filter(row => (row['reaction'] != null) & (row['roleId'] != null));

            if (filteredResults.length == 0) {
                reject(new Error("No reaction roles set up for this group"));
            }

            filteredResults.forEach(row => {
                embed.addFields({ name: row['reaction'], value: `<@&${row['roleId']}>`, inline: true });
            });

            let reactions = results.map(row => row['reaction']);

            resolve([embed, reactions]);
        });
    });
}

module.exports = {
    name: 'rr',
    hidden: true,
    permissions: [perms.checkIsOwner()],
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
                    .setAutocomplete(true))
            .addStringOption(option =>
                option.setName('role_to_remove')
                    .setDescription('The role to remove from the group')
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
                    .setDescription('The link of the message to be set as the reaction message'))
        ),

    /** 
     * @param {Bot} bot 
     * @param {ChatInputCommandInteraction} interaction 
     */
    run: async (bot, interaction) => {
        if (interaction.member.id !== ownerID) {
            return;
        }

        switch (interaction.options.getSubcommand()) {
            case 'view':
                {
                    const embed = utils.getDefaultMessageEmbed(bot, { title: 'Reaction Roles' });
                    embed.setDescription('View Reaction Group information');
                    embed.addFields({ name: 'No group selected', value: 'Select a group to view information about it!' });
                    interaction.reply({ embeds: [embed], fetchReply: true }).then(reply => {
                        const query = `SELECT groupName FROM reactiongroups WHERE serverId=${interaction.guildId}`;
                        bot.database.query(query, function (err, result) {
                            if (err) {
                                return interaction.reply({
                                    embeds: [
                                        utils.getDefaultMessageEmbed(bot, { title: 'Error', color: colors.Red })
                                            .setDescription(`${err}`)
                                            .addFields({ name: 'Query', value: `Parsed query: ${query}` })
                                    ]
                                });
                            }

                            const selectRow = new ActionRowBuilder();
                            const selectMenu = new StringSelectMenuBuilder()
                                .setCustomId('rrGroupView')
                                .setPlaceholder('Nothing selected');

                            result.forEach(row => {
                                selectMenu.addOptions({ label: row['groupName'], value: row['groupName'] })
                            });
                            selectRow.addComponents(selectMenu);

                            interaction.editReply({ components: [selectRow] });
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
                    const embed = utils.getDefaultMessageEmbed(bot, { title: 'Reaction Roles' });
                    embed.setDescription('Choose a group to remove\n**Selecting an option will immediately delete it! Be Careful!**')
                        .setColor(colors.Red);
                    interaction.reply({ embeds: [embed], fetchReply: true }).then(reply => {
                        const query = `SELECT groupName FROM reactiongroups WHERE serverId=${interaction.guildId}`;
                        bot.database.query(query, function (err, result) {
                            if (err) {
                                return interaction.reply({
                                    embeds: [
                                        utils.getDefaultMessageEmbed(bot, { title: 'Error', color: colors.Red })
                                            .setDescription(`${err}`)
                                            .addFields({ name: 'Query', value: `Parsed query: ${query}` })
                                    ]
                                });
                            }

                            const selectRow = new ActionRowBuilder();
                            const selectMenu = new StringSelectMenuBuilder()
                                .setCustomId('rrGroupDelete')
                                .setPlaceholder('Nothing selected');

                            result.forEach(row => {
                                selectMenu.addOptions({ label: row['groupName'], value: row['groupName'] })
                            });
                            selectRow.addComponents(selectMenu);

                            interaction.editReply({ components: [selectRow] });
                        });
                    });
                }
                break;
            case 'addrole':
                {
                    const groupName = interaction.options.getString('group');
                    const role = interaction.options.getMentionable('role');
                    const reaction = interaction.options.getString('reaction');

                    const embed = utils.getDefaultMessageEmbed(bot, { title: 'Reaction Roles' });
                    embed.setTitle(groupName).setColor(colors.Orange);
                    embed.addFields(
                        { name: `Group`, value: `${groupName}` },
                        { name: `Role`, value: `${role}`, inline: true },
                        { name: `Reaction`, value: `${reaction}`, inline: true }
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
                    const role = interaction.options.getMentionable('role_to_remove');

                    const embed = utils.getDefaultMessageEmbed(bot, { title: 'Remove Role' }).setColor(colors.Orange);

                    const results = await bot.asyncQuery(`SELECT reaction FROM reactionGR WHERE groupName='${groupName}' AND serverId='${interaction.guildId}' AND roleId='${role.id}'`)
                    const reaction = results[0]['reaction'];

                    embed.addFields(
                        { name: `Group`, value: groupName },
                        { name: `Role`, value: role, inline: true },
                        { name: `Reaction`, value: reaction, inline: true }
                    );
                    const row = new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId('rrAcceptRemoveRole')
                                .setLabel('Correct!')
                                .setStyle(ButtonStyle.Success),
                            new ButtonBuilder()
                                .setCustomId('rrCancelRemoveRole')
                                .setLabel('Nononononono!')
                                .setStyle(ButtonStyle.Danger),
                        );
                    interaction.reply({ embeds: [embed], components: [row] });
                }
                break;
            case 'sendmessage':
                await interaction.deferReply();
                try {
                    const groupName = interaction.options.getString('group');
                    const channel = interaction.options.getChannel('channel');

                    const temp = await createReactionEmbed(bot, groupName, interaction.guildId);
                    const reactionEmbed = temp[0];
                    const reactions = temp[1];

                    const resp = utils.getDefaultMessageEmbed(bot, { title: "Reaction Message Sent" });

                    const message = await channel.send({ embeds: [reactionEmbed], fetchReply: true });

                    for (let reacc of reactions) {
                        await message.react(reacc);
                    }

                    const urlToMessage = hyperlink('Go to message', message.url);

                    resp.setDescription(`The message was sent to ${channel}.\n${urlToMessage}`);
                    interaction.editReply({ embeds: [resp] });
                } catch (err) {
                    const errMsg = utils.getDefaultMessageEmbed(bot, { title: "Error", color: colors.Red });
                    errMsg.setDescription(`Error Message: ${err.message}`);
                    interaction.editReply({ embeds: [errMsg] });
                }
                break;
            case 'setmessage':
                const groupName = interaction.options.getString('group');
                let messageURL = interaction.options.getString('message_link');

                const embed = utils.getDefaultMessageEmbed(bot, { title: "Set Message" });
                embed.setDescription(`Setting the reaction message for group **${groupName}**`);
                const resp = await interaction.reply({ embeds: [embed], fetchReply: true });

                if (messageURL == null) {
                    embed.addFields({ name: 'Please enter the link to the message in chat', value: 'Copy the link to the message that you want to set as the reaction message' });
                    embed.setImage('https://i.imgur.com/AxQ9Sbg.png');

                    messageURL = await new Promise((resolve) => {
                        interaction.editReply({ embeds: [embed] }).then(() => {
                            const message_filter = m =>
                                m.author.id == interaction.user.id;
                            interaction.channel.awaitMessages({ filter: message_filter, max: 1, time: 30000, errors: ['time'] })
                                .then(collected => {
                                    const msgURL = collected.first().content;
                                    collected.first().delete();
                                    resolve(msgURL);
                                }).catch(err => {
                                    resolve(null);
                                });
                        });
                    });
                    if (messageURL == null) {
                        embed.setFields({ name: 'Unable to parse link!', value: 'The link you provided isn\'t a valid link to a message on this server!' });
                        embed.setImage(null);
                        interaction.editReply({ embeds: [embed] }).then(() => {
                            setTimeout(() => { resp.delete(); }, 10 * 1000);
                        });
                        return;
                    }
                }

                const tokens = messageURL.split('/');
                const channelId = tokens[tokens.length - 2];
                const messageId = tokens[tokens.length - 1];

                interaction.guild.channels.fetch(channelId).then(channel => {
                    channel.messages.fetch(messageId).then(message => {
                        const resp = utils.getDefaultMessageEmbed(bot, { title: "Set Message" });
                        resp.setDescription('Is this the correct message? **(yes/no)**');
                        resp.addFields(
                            { name: `Channel`, value: channel.toString() },
                            { name: `Link to Message`, value: hyperlink('Go to message', messageURL) },
                            { name: `Message Content`, value: message.content ?? "Message is empty" }
                        );
                        interaction.editReply({ embeds: [resp] });

                        const message_filter = m =>
                            m.author.id == interaction.user.id;

                        interaction.channel.awaitMessages({ filter: message_filter, max: 1, time: 30000, errors: ['time'] })
                            .then(collected => {
                                const response = collected.first().content;
                                collected.first().delete().then(() => {
                                    if (response.toLowerCase() == 'yes') {
                                        // SELECT IDENT_CURRENT(‘TableName’) 
                                        bot.database.query(`INSERT INTO reactionmessages (serverId, channelId, messageId) VALUES (?,?,?)`, [interaction.guildId, channelId, messageId], function (err, result) {
                                            if (err) {
                                                return interaction.editReply({ embeds: [utils.getDefaultMessageEmbed(bot, { title: "Set Message", description: "The message has not been set!\nThat message already belongs to a group!", color: colors.FireBrick })] });
                                            }
                                            bot.database.query(`SELECT MAX(rMessageKEY) FROM reactionmessages AS pKey`, function (err, results) {
                                                if (err) { console.err(err); }
                                                const rMessageKEY = results[0]["MAX(rMessageKEY)"];

                                                bot.database.query(`UPDATE reactiongroups SET rMessageKEY=? WHERE serverId=? AND groupName=?`, [rMessageKEY, interaction.guildId, groupName]);
                                            });
                                        });
                                        interaction.editReply({ embeds: [utils.getDefaultMessageEmbed(bot, { title: "Set Message", description: "The message has been set!" }).addFields({ name: `Link to Message`, value: hyperlink('Go to message', messageURL) })] })
                                            .then(() => {
                                                createReactionEmbed(bot, groupName, interaction.guildId)
                                                .then(result => {
                                                    promises = [];
                                                    result[1].forEach(reacc => promises.push(new Promise((r1, r2) => { r1(message.react(reacc)); })));
                                                    Promise.all(promises);
                                                });
                                            });
                                    } else {
                                        interaction.editReply({ embeds: [utils.getDefaultMessageEmbed(bot, { title: "Set Message", description: "The message has not been set!" })] });
                                    }
                                });
                            });
                    });
                }).catch(err => {
                    interaction.editReply({
                        embeds: [
                            utils.getDefaultMessageEmbed(bot, { title: "Set Message", description: "That doesn't look like a valid message url!" })
                        ]
                    }).then(m => { setTimeout(() => { m.delete(); }, 10 * 1000); });
                });
                break;
        }
    }
};