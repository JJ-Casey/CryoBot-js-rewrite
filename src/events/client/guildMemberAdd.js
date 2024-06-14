const { ActivityType, Events } = require("discord.js");
const Bot = require("../../../Bot");
const { prefix } = require("../../../config.json");
const dayjs = require("dayjs");
const utils = require("../../utils/discordUtils.js");

/**
 * `ready` event.
 * Triggers once the bot loads all the other events and goes online.
 * Useful to show ready messages and do/set things at startup.
 *
 * @param {Bot} bot
 */
module.exports = {
  eventName: Events.GuildMemberAdd,
  callback: async (bot, member) => {
    const serverId = member.guild.id;
    const isBot = member.user.bot ? 1 : 0;
    const joinedAt = dayjs(member.joinedAt).format("YYYY/MM/DD");
    bot
      .asyncQuery(
        `INSERT INTO members (serverId, memberId, bot, joinDate) VALUES ('${serverId}', '${member.id}', '${isBot}', '${joinedAt}')`
      )
      .catch(console.error);
  },
};
