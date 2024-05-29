const { EmbedBuilder } = require('discord.js');
const Bot = require('../../Bot');
const colors = require('../utils/colors.js');

module.exports = {
    emptyEmbed: '\u200b',
    resolveMember(guild, memberIdentification) {
        if (!memberIdentification | memberIdentification.length == 0) {
            return null;
        }
        // check for mention
        const parsed_id = parseId(memberIdentification)
        if (parsed_id) {
            return guild.members.cache.get(parsed_id);
        }
        // check if is id
        if (!isNaN(memberIdentification)) {
            return guild.members.cache.get(memberID);
        }
        return null;
    },
    parseId(mention) {
        if (mention.startsWith('<@&') && mention.endsWith('>')) {
            // It's a role mention
            return mention.slice(3, mention.length - 1);
        }
        if (mention.startsWith('<@') && mention.endsWith('>')) {
            // It's a user mention
            return mention.slice(2, mention.length - 1);
        }
        if (mention.startsWith('<#') && mention.endsWith('>')) {
            // It's a channel mention
            return mention.slice(2, mention.length - 1);
        }
        return null;
    },
    getDefaultMessageEmbed(bot, embedParams = {}) {
        embedParams = {
            ...{
                color: colors.DefaultEmbed
            },
            ...embedParams
        };
        return new EmbedBuilder(embedParams)
        .setAuthor({ name: bot.user.username, iconURL: bot.user.displayAvatarURL({ dynamic: true}) })
        .setTimestamp()
        .setFooter({ text: bot.user.username, iconURL: bot.user.displayAvatarURL({ dynamic: true}) });
    },
    raiseError(bot, error) {
        return bot.emit("error", error);
    }
}
