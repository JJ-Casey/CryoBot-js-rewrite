const { Interaction, ActionRowBuilder, ButtonBuilder, ButtonStyle, bold, parseEmoji, formatEmoji, hyperlink } = require('discord.js');
const Bot = require('../../../Bot');
const colors = require('../../utils/colors.js');
const utils = require('../../utils/discordUtils.js');

module.exports = {
    eventName: 'interactionCreate',
    /**
     * 
     * @param {Bot} bot 
     * @param {Interaction} interaction 
     */
    callback: async (bot, interaction) => {
        
        if (interaction.isAutocomplete()) {
            if (!interaction.commandName.startsWith('rr')) return
            const focusedOption = interaction.options.getFocused(true);
            const focusedValue = focusedOption.value.toLowerCase();

            switch (focusedOption.name) {
                case 'group':
                    const query = `SELECT groupName FROM reactiongroups WHERE serverId=${interaction.guildId}`;
                    bot.database.query(query, function (err, result) {
                        const groupNames = result.map(({groupName}) => groupName);
                        const filtered = groupNames.filter(groupName => groupName.toLowerCase().startsWith(focusedValue));
                        interaction.respond(
                            filtered.map(choice => ({ name: choice, value: choice }))
                        );
                    });
                break;
            }
        }

        if (!interaction.customId) return;
        if (!interaction.customId.startsWith('rr')) return;

        if (interaction.isModalSubmit()) {
            switch (interaction.customId) {
                case 'rrCreateReactionGroup':
                    const groupName = interaction.fields.getTextInputValue('groupName');
                    const groupDesc = interaction.fields.getTextInputValue('groupDesc');
                    
                    const query1 = `SELECT COUNT(1) FROM reactiongroups WHERE serverID=${interaction.guildId} AND groupName= ? `;
                    bot.database.query(query1, [ groupName ], function (err, result) {
                        if (result[0]['COUNT(1)']) {
                            return interaction.reply({
                                embeds: [
                                    utils.getDefaultMessageEmbed(bot, { title: 'Reaction Roles', color: colors.Red })
                                        .setDescription('Group name already exists!')
                                        .addFields(
                                            { name: 'Group Name', value: `**${groupName}**` },
                                            )
                                ]
                            });
                        }
                        const query2 = `INSERT INTO reactiongroups (serverId, groupName, description) VALUES (${interaction.guildId}, ? , ? )`;
                        bot.database.query(query2, [ groupName, groupDesc ], function (err, result) {
                            if (err) { return console.error(err.stack); }
                            interaction.reply({
                                embeds: [
                                    utils.getDefaultMessageEmbed(bot, { title: 'Reaction Roles', color: colors.Green })
                                        .setDescription('Confirmed!')
                                        .addFields(
                                            { name: 'Group Added', value: `Group **${groupName}** added!` },
                                            { name: 'Description', value: `${groupDesc}` }
                                            )
                                ]
                            });
                        });
                    });
                break;
            }
        }
        if (interaction.isStringSelectMenu()) {
            switch (interaction.customId) {
                case 'rrGroupDelete':
                    {
                        interaction
                        const groupName = interaction.values[0];
                        bot.database.query(`DELETE FROM reactiongroups WHERE serverId=${interaction.guildId} AND groupName='${groupName}'`, function (err, result) {
                            if (err) { return console.log(err.stack); }
                            interaction.update({
                                embeds: [
                                    utils.getDefaultMessageEmbed(bot, { title: 'Reaction Roles', color: colors.Green })
                                    .setDescription('Deleted!')
                                    .addFields({ name: 'Group Deleted', value: `Group **${groupName}** removed!` })
                                ], components: []
                            });
                        });
                    }
                break;
                case 'rrGroupView':
                    {
                        // SELECT column_name(s) FROM table1 INNER JOIN table2 ON table1.column_name = table2.column_name;
                        const groupName = interaction.values[0];
                        const embed = utils.getDefaultMessageEmbed(bot, { title:'Reaction Roles' })
                            .setDescription('View Reaction Group information');
                        embed.addFields({ name: `Group: ${groupName}`, value: 'Loading...' });
                        
                        interaction.update({ embeds:[embed], fetchReply:true}).then(message => {
                            // Reaction Group Information
                            let query = `SELECT rg.*, rr.*, rm.* FROM reactionroles AS rr RIGHT JOIN reactiongroups AS rg ON rr.rGroupKEY = rg.rGroupKEY LEFT JOIN reactionmessages AS rm ON rg.rMessageKEY = rm.rMessageKEY WHERE rg.serverId='${interaction.guildId}' AND rg.groupName='${groupName}'`;
                            bot.database.query(query, function (err, result) {
                                if (err) { return message.edit({ embeds: [utils.getDefaultMessageEmbed(bot, { title: 'Error', color: colors.Red }).setDescription(`${err}`)] }); }

                                if (!result.length) { return; }

                                const desc = result[0]['description'];
                                const channelId = result[0]['channelId']
                                const messageId = result[0]['messageId'];

                                let messLink;
                                if ([channelId, messageId].some(x => x == null)) {
                                    messLink = 'No message associated with reaction group';
                                } else {
                                    messLink = hyperlink('message link', `https://discord.com/channels/${serverId}/${channelId}/${messageId}`);
                                }

                                embed.setFields(
                                    { name: groupName, value: desc },
                                    { name:'Message', value: messLink }
                                    );

                                const hasRoles = result[0]['roleId'];
                                if (hasRoles) {
                                    result.forEach(row => {
                                        const reacc = row['reaction'];
                                        const roleId = row['roleId'];
                                        if ([reacc, roleId].some(x => x == null)) {return;}
                                        embed.addFields({ name: `Reaction: ${reacc}`, value: `Role: <@&${roleId}>`, inline: true});
                                    });
                                } else {
                                    embed.addFields({ name: `Reaction Roles`, value: `No reaction roles have been set up for this group`, inline: true});
                                }
                                message.edit({ embeds:[embed] });
                            });
                        });
                    }
                break;
            }
        }
        if (interaction.isButton()) {
            switch (interaction.customId) {
                case 'rrCorrect':
                    {
                        // https://discordjs.guide/interactions/select-menus.html#accessing-select-menu-interaction-values
                        const groupName = interaction.message.embeds[0].fields[0].value;
                        bot.database.query(`INSERT INTO reactiongroups (serverId, groupName) VALUES (${interaction.guildId}, '${groupName}')`, function (err, result) {
                            if (err) { interaction.reply({ embeds: [utils.getDefaultMessageEmbed(bot, { title: 'Error', color: colors.Red }).setDescription(`${err}`)] }); }
                            interaction.update({
                                embeds: [
                                    utils.getDefaultMessageEmbed(bot, { title: 'Reaction Roles', color: colors.Green })
                                        .setDescription('Confirmed!')
                                        .addField('Group Added', `Group **${groupName}** added!`)
                                ], components: []
                            });
                        });
                    }
                    break;
                case 'rrIncorrect':
                    const embed = utils.getDefaultMessageEmbed(bot, { title: 'Reaction Roles', color: colors.Red })
                        .setDescription('Group information rejected')
                        .addField('Cancelled Adding Group', 'To try adding a group again, use the command again!');
                    interaction.update({ embeds: [embed], components: [] });
                    setTimeout(() => { interaction.message.delete(); }, 10000);
                    break;
                case 'rrDelete':
                    interaction.message.delete();
                    break;
                case 'rrRemove':
                    {
                        const groupName = interaction.message.embeds[0].fields[0].value;
                        
                        bot.database.query(`DELETE FROM reactiongroups WHERE serverId=${interaction.guildId} AND groupName='${groupName}'`, function (err, result) {
                            if (err) { interaction.reply({ embeds: [utils.getDefaultMessageEmbed(bot, { title: 'Error', color: colors.Red }).setDescription(`${err}`)] }); }
                            interaction.update({
                                embeds: [
                                    utils.getDefaultMessageEmbed(bot, { title: 'Reaction Roles', color: colors.Green })
                                    .setDescription('Deleted!')
                                    .addField('Group Deleted', `Group **${groupName}** removed!`)
                                ], components: []
                            });
                        });
                        setTimeout(() => { interaction.message.delete(); }, 10000);
                    }
                    break;
                case 'rrAcceptAddRole':
                    {
                        const embFields = interaction.message.embeds[0].fields;
                        const groupName = embFields[0].value;
                        const roleMention = embFields[1].value;
                        const roleID = ((x) => {
                            if (x.startsWith('<@&') && x.endsWith('>')) {
                                return x.slice(3, x.length - 1);
                            }
                            return null;
                        })(roleMention);
                        const rawReacc = embFields[2].value;
                        const unicodeRegex = /\p{Extended_Pictographic}/gu
                        const isUnicode = unicodeRegex.test(rawReacc);

                        const embed = utils.getDefaultMessageEmbed(bot);

                        // Validation
                        let valid = true;
                        if (roleID == null) {
                            valid = false;
                            embed.setColor(colors.Red);
                            embed.addFields({ name: 'Invalid Role', value: `${roleMention} isn't a valid role in this server!` });
                        }
                        if (!isUnicode) {
                            const reacc = parseEmoji(rawReacc);
                            if (interaction.guild.emojis.cache.get(reacc.id) == null) {
                                valid = false;
                                embed.setColor(colors.Red);
                                embed.addFields({ name: 'Invalid Reaction Emoji', value: `The emoji ${rawReacc} isn't a valid emoji in this server!` });
                            }
                        }

                        /***
                         * Add in a check to see if, for the chosen reaction group
                         * :: the reaction doesn't already exist for a role
                         * :: the role doesn't already exist
                         * 
                         * Thoughts:
                         * - Get rGroupKey
                         * - Get all reaction roles
                         * - Map results to reactions and roles
                         * - Check if reaction or role exist in those arrays
                         * - If not, insert
                         ***/
                        if (!valid) {
                            interaction.update({ embeds : [ embed ], components : [] });
                            return;
                        }

                        bot.database.query(`SELECT rGroupKey FROM reactiongroups WHERE serverId='${interaction.guildId}' AND groupName='${groupName}'`, function (err, res) {
                            const rGroupKey = res[0]['rGroupKey'];
                            bot.database.query(`INSERT INTO reactionroles (rGroupKey, reaction, roleId) VALUES ('${rGroupKey}', '${rawReacc}', '${roleID}')`, function (err, result) {
                                if (err) { return console.error(err.stack); }
                                interaction.update({
                                    embeds: [
                                        utils.getDefaultMessageEmbed(bot, { title: 'Reaction Roles', color: colors.Green })
                                            .addFields({ name: 'Reaction Role Added', value: `The role ${roleMention} has been added to ${bold(groupName)} with the reaction ${rawReacc}` })
                                    ], components: []
                                });
                            });
                        });
                    }
                break;
                case 'rrCancelAddRole':
                    {
                        // https://discordjs.guide/interactions/select-menus.html#accessing-select-menu-interaction-values
                        const embFields = interaction.message.embeds[0].fields;
                        const groupName = embFields[0].value;
                        const role = embFields[1].value;
                        const reacc = parseEmoji(embFields[2].value);

                        console.log(`${groupName} ${role} ${reacc}`);
                        interaction.reply('D:');
                        // bot.database.query(`INSERT INTO reactiongroups (serverId, groupName) VALUES (${interaction.guildId}, '${groupName}')`, function (err, result) {
                        //     if (err) { interaction.reply({ embeds: [utils.getDefaultMessageEmbed(bot, { title: 'Error', color: colors.Red }).setDescription(`${err}`)] }); }
                        //     interaction.update({
                        //         embeds: [
                        //             utils.getDefaultMessageEmbed(bot, { title: 'Reaction Roles', color: colors.Green })
                        //                 .setDescription('Confirmed!')
                        //                 .addField('Group Added', `Group **${groupName}** added!`)
                        //         ], components: []
                        //     });
                        // });
                    }
                break;
            }
        }
    }
}