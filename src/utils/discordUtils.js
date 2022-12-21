const { EmbedBuilder } = require('discord.js');
const Bot = require('../../Bot');
const colors = require('../utils/colors.js');

module.exports = {
    /** 
    * @param {Bot} bot
    */
    resolveMember(guild, memberIdentification) {
        if (!memberIdentification | memberIdentification.length == 0) {
            return null;
        }
        // check for mention
        if (memberIdentification.startsWith('<@')) {
            memberID = memberIdentification.slice(3,-1);
            return guild.members.cache.get(memberID);
        }
        // check if is id
        if (!isNaN(memberIdentification)) {
            return guild.members.cache.get(memberID);
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
    }
}
