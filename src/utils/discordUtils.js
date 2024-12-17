const { EmbedBuilder, Message } = require("discord.js");
const Bot = require("../../Bot");
const colors = require("../utils/colors.js");

module.exports = {
  emptyEmbed: "\u200b",
  deleteNoError(timeout) {
    return (msg) => {
      setTimeout(() => {
        msg.delete().catch((e) => {});
      }, timeout);
    };
  },
  resolveMember(guild, memberIdentification) {
    if (!memberIdentification | (memberIdentification.length == 0)) {
      return null;
    }
    // check for mention
    const parsed_id = parseId(memberIdentification);
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
    if (mention.startsWith("<@&") && mention.endsWith(">")) {
      // It's a role mention
      return mention.slice(3, mention.length - 1);
    }
    if (mention.startsWith("<@") && mention.endsWith(">")) {
      // It's a user mention
      return mention.slice(2, mention.length - 1);
    }
    if (mention.startsWith("<#") && mention.endsWith(">")) {
      // It's a channel mention
      return mention.slice(2, mention.length - 1);
    }
    return null;
  },
  checkIsUnmoderatable(member) {
    const unmoderateable_roles = [
      "753647872465043596", // Some Dude
      "753647463138721822", // Admins
      "731177392760029205", // Mods
      "884501719810183179", // Soul Wardens
      "993177661532803142", // Community Helpers
      "817199959959011348", // Bots
      "733678058661216256", // JJ Admins
      //   "@everyone",
    ];

    const target_role_intersection = member.roles.cache
      .map((role) => role.id)
      .filter((rId) => unmoderateable_roles.includes(rId));
    return target_role_intersection.length > 0;
  },
  getDefaultMessageEmbed(bot, embedParams = {}) {
    embedParams = {
      ...{
        color: colors.DefaultEmbed,
      },
      ...embedParams,
    };
    return new EmbedBuilder(embedParams)
      .setAuthor({
        name: bot.user.username,
        iconURL: bot.user.displayAvatarURL({ dynamic: true }),
      })
      .setTimestamp()
      .setFooter({
        text: bot.user.username,
        iconURL: bot.user.displayAvatarURL({ dynamic: true }),
      });
  },
  raiseError(bot, error) {
    return bot.emit("error", error);
  },
};
