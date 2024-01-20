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
            if (!interaction.commandName.startsWith('rem-permission')) return
            const focusedOption = interaction.options.getFocused(true);
            const focusedValue = focusedOption.value.toLowerCase();

            switch (focusedOption.name) {
                case 'command':
                    {
                        interaction.respond(
                            bot.slashCommands.map(command => command.name)
                                .filter(command => command.toLowerCase().startsWith(focusedValue))
                                .map(choice => ({ name: choice, value: choice }))
                        );
                    }
                    break;
            }
        }
        if (interaction.isButton()) {
            if (!interaction.customId.startsWith('permRemove')) return;
            const tokens = interaction.customId.split('-');
            const customId = tokens[0];
            const userId = tokens[1];
            const commandName = interaction.message.embeds[0].fields[0].value;

            if (interaction.member.id != userId) {
                return interaction.reply({ content: 'You aren\'t allowed to press this!', ephemeral: true });
            }

            switch (customId) {
                case 'permRemoveConfirm':
                    const embedReply = interaction.message.embeds[0];
                    const is_role = embedReply.fields[1].name.startsWith('Role');

                    const parsedId = utils.parseId(embedReply.fields[1].value);

                    if (is_role) {
                        // Remove perms from rolePermissions
                        bot.database.query(`DELETE FROM rolePermissions WHERE serverId=? AND commandName=? AND roleId=?`, [interaction.guildId, commandName, parsedId], function (err, results) {
                            if (err) return console.error(err.stack);
                            const embed = utils.getDefaultMessageEmbed(bot, { color: colors.Green })
                            .addFields(
                                { name: utils.emptyEmbed, value: `The role ${embedReply.fields[1].value} has had their permissions removed for the command \`${commandName}\`` }
                            );
                        return interaction.update({ content: '', embeds: [embed], components: [] })
                            .then(msg => { setTimeout(() => msg.delete(), 5000) });
                        });
                    } else {
                        // Add perms to memberPermissions
                        bot.database.query(`DELETE FROM memberPermissions WHERE serverId=? AND commandName=? AND userId=?`, [interaction.guildId, commandName, parsedId], function (err, results) {
                            if (err) return console.error(err.stack);
                            const embed = utils.getDefaultMessageEmbed(bot, { color: colors.Green })
                            .addFields(
                                { name: utils.emptyEmbed, value: `The User ${embedReply.fields[1].value} has had their permissions removed for the command \`${commandName}\`` }
                            );
                        return interaction.update({ content: '', embeds: [embed], components: [] })
                            .then(msg => { setTimeout(() => msg.delete(), 5000) });
                        });
                    }
                    break;
                case 'permRemoveDeny':
                    interaction.update({ content: 'Make up your mind <:hmmmDisapprove:1070371741731401761>', embeds: [], components: [] })
                        .then(msg => { setTimeout(() => msg.delete(), 5000) })
                    break
            }
        }
    }
}