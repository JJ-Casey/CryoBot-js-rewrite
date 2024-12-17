const { User, MessageReaction } = require("discord.js");
const Bot = require("../../../../Bot");
const utils = require("../../../utils/discordUtils.js");

module.exports = {
  eventName: "messageReactionRemove",
  /**
   * @param {Bot} bot
   * @param {MessageReaction} reaction
   * @param {User} user
   */
  callback: async (bot, reaction, user) => {
    // console.log(JSON.stringify(reaction, user));
    if (user.bot) return;

    if (reaction.partial) {
      try {
        await reaction.fetch();
      } catch (e) {
        return bot.emit("error", e);
      }
    }

    const messageId = reaction.message.id;
    const reacc = reaction.emoji;
    const query = `SELECT roleId FROM reactionGRM WHERE messageId=? AND reaction=? AND serverId=?`;

    bot.database.query(
      query,
      [messageId, reacc.toString(), reaction.message.guildId],
      function (err, result) {
        if (err) {
          return bot.emit("error", err);
        }

        if (result.length === 0) return;

        const guild = bot.guilds.cache.get(reaction.message.guildId);
        const roleToRemove = guild.roles.cache.find(
          (role) => role.id === result[0].roleId
        );
        if (!roleToRemove) {
          guild.roles.fetch();
          roleToRemove = guild.roles.cache.find(
            (role) => role.id === result[0].roleId
          );
        }
        const member = guild.members.cache.get(user.id);
        if (!member) {
          member = guild.members.fetch(user.id);
        }
        member.roles.remove(roleToRemove);
      }
    );
  },
};
