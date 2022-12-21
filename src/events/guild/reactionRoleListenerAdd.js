const { User, MessageReaction } = require('discord.js');
const Bot = require('../../../Bot');

module.exports = {
    eventName: 'messageReactionAdd',
    /**
     * @param {Bot} bot 
     * @param {MessageReaction} reaction 
     * @param {User} user 
     */
    callback: async (bot, reaction, user) => {
        if (reaction.partial) {
            try {
                await reaction.fetch();
            } catch (e) {
                console.error('error', e => console.error(`${chalk.redBright('[Error]')} - ${e.stack}`));
                return;
            }
        }

        const messageId = reaction.message.id;
        const reacc = reaction.emoji;
        const query = `SELECT role FROM reactionroles WHERE messageId=${messageId} AND reaction='${reacc}' AND serverId=${reaction.message.guildId}`;

        bot.database.query(query, function (err, result) {
            if (err) { return reaction.message.channel.send(embeds = [ utils.getDefaultMessageEmbed(bot, { title:'Error', description: `Message: ${err}` })]);}

            if (result.message) {
                return;
            } else {
                const guild = bot.guilds.cache.get(reaction.message.guildId);
                const roleToAdd = guild.roles.cache.find(role => role.name === result[0].role);
                if (!roleToAdd) {
                    guild.roles.fetch();
                    roleToAdd = guild.roles.cache.find(role => role.name === result[0].role);
                }
                const member = guild.members.cache.get(user.id);
                if (!member) {
                    member = guild.members.fetch(user.id);
                }
                member.roles.add(roleToAdd);
            }
        });
    }
}