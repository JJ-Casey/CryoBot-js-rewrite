const { Message } = require("discord.js");
const Bot = require("../../../../Bot");

prob = 0.01;
gif_link =
  "https://media.discordapp.net/attachments/1132816375937765467/1222366003707646094/163.gif";

module.exports = {
  eventName: "messageCreate",
  /**
   *
   * @param {Bot} bot
   * @param {Message} message
   */
  callback: async (bot, message) => {
    if (message.author.bot) return;
    if (!message.inGuild()) return;
    if (message.guildId != "724753586461868132") return;
    if (message.author.id != "539443960813191179") return;

    const runi = Math.random();

    if (runi < prob) {
      await message.reply({
        content: gif_link,
        allowedMentions: { repliedUser: false },
      });
    }
  },
};
