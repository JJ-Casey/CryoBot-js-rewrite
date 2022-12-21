const { Interaction } = require('discord.js');
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
        if (!interaction.customId) return;
        if (!interaction.customId.startsWith('rr')) return;

        if (interaction.isModalSubmit()) {
            // handle modal submits
            switch (interaction.customId) {
                case 'rrCreateReactionGroup':
                    const groupName = interaction.fields.getTextInputValue('groupName');
                    const groupDesc = interaction.fields.getTextInputValue('groupDesc');
                    
                    bot.database.query(`SELECT COUNT(1) FROM reactiongroups WHERE serverID=${interaction.guildId} AND groupName='${groupName}'`, function (err, result) {
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
                        bot.database.query(`INSERT INTO reactiongroups (serverId, groupName, description) VALUES (${interaction.guildId}, '${groupName}', '${groupDesc}')`, function (err, result) {
                            if (err) { interaction.reply({ embeds: [utils.getDefaultMessageEmbed(bot, { title: 'Error', color: colors.Red }).setDescription(`${err}`)] }); }
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
                        const groupName = interaction.values[0];
                        bot.database.query(`DELETE FROM reactiongroups WHERE serverId=${interaction.guildId} AND groupName='${groupName}'`, function (err, result) {
                            if (err) { interaction.reply({ embeds: [utils.getDefaultMessageEmbed(bot, { title: 'Error', color: colors.Red }).setDescription(`${err}`)] }); }
                            interaction.reply({
                                embeds: [
                                    utils.getDefaultMessageEmbed(bot, { title: 'Reaction Roles', color: colors.Green })
                                    .setDescription('Deleted!')
                                    .addFields({ name: 'Group Deleted', value: `Group **${groupName}** removed!` })
                                ]
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
                        embed.addFields({ name:groupName, value:'Loading...' });
                        interaction.update({ embeds:[embed], fetchReply:true}).then(() => {
                            const query = `SELECT * FROM reactiongroups LEFT JOIN reactionroles ON reactiongroups.groupName=reactionroles.groupName WHERE reactiongroups.groupName='${groupName}'`;
                            bot.database.query(query, function (err, result) {
                                if (err) { interaction.reply({ embeds: [utils.getDefaultMessageEmbed(bot, { title: 'Error', color: colors.Red }).setDescription(`${err}`)] }); }
                                embed.setFields({ name:groupName, value:result.shift()['description'] });
                                result.forEach(row => {
                                    embed.addFields({ name:row['reaction'], value:row['role']});
                                });
                                interaction.message.edit({ embeds:[embed] });
                            });
                        });
                    }
                break;
            }
        }
        if (interaction.isButton()) {
            switch (interaction.customId) {
                case 'rrAddRole':
                    {
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
            }
        } 
    }
}