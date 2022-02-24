const { Message, MessageEmbed, GuildMember } = require('discord.js');
const Bot = require('../../Bot');
const colors = require('../../colors.json');

module.exports = {
    /** 
    * @param {Bot} bot
    */
    resolveMember(guild, memberIdentification) {
        if (memberIdentification.length == 0) {
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
        return new MessageEmbed(embedParams)
        .setTimestamp()
        .setColor(colors.DefaultEmbed)
        .setFooter(bot.user.username, bot.user.displayAvatarURL({ dynamic: true}));
    }
}
