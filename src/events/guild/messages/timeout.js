const { Message } = require("discord.js");
const Bot = require("../../../../Bot");

// Add to DB?
// Nasch, Light
probs = {
  "315471044951670784": 0.001,
  "281844036715937795": 0.001,
};

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
    if (!(message.author.id in probs)) return;

    const runi = Math.random();

    if (runi < probs[message.author.id]) {
      const member = message.guild.members.cache.get(message.author.id);
      await message.reply("<:shut:1285955285730590764>");
      await member.timeout(69 * 1000, "Grrrr");
    }
  },
};
