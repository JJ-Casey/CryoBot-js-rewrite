const { Message } = require("discord.js");
const Bot = require("../../Bot");

module.exports = {
  name: "name",
  aliases: [],
  usage: "name (args)",
  description: "Description",

  /**
   * @param {Bot} bot
   * @param {Message} message
   * @param {string[]} args
   */
  run: async (bot, message, args) => {
    // command logic here
  },
};
