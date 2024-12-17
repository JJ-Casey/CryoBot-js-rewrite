const { Message } = require("discord.js");
const Bot = require("../../../../Bot");

module.exports = {
  eventName: "messageCreate",
  /**
   *
   * @param {Bot} bot
   * @param {Message} message
   */
  callback: async (bot, message) => {
    if (message.author.bot) return;

    bot
      .asyncQuery(
        `SELECT reaction, probability FROM memberreactions AS mr INNER JOIN members ON mr.memberKEY=members.memberKEY WHERE serverId=${message.guildId} AND memberId=${message.author.id}`
      )
      .then((results) => {
        if (results.length == 0) return;

        const zip = results.map((row) => [row["reaction"], row["probability"]]);

        let probSum = 0;

        const runi = Math.random();

        for (let x of zip) {
          probSum += x[1];
          if (runi < probSum) {
            message.react(x[0]);
            break;
          }
        }
      });
  },
};
