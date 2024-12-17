const { BaseInteraction, SlashCommandBuilder } = require("discord.js");
const Bot = require("../../../Bot");
const utils = require("../../utils/discordUtils.js");

module.exports = {
  name: "faker",
  usage: "faker",
  hidden: false,
  permissions: [],
  description: "Faker Mentioned",
  category: "Standard Commands",

  slash: new SlashCommandBuilder().setName("faker").setDescription("Faker Mentioned"),

  /**
   * @param {Bot} bot
   * @param {BaseInteraction} interaction
   */
  run: async (bot, interaction) => {
    const response = `<a:fakerShush:1261673412128931941> MENTIONED POST <a:closeShave:1259834571537645640>\n<a:fakerShush:1261673412128931941> MENTIONED POST <a:closeShave:1259834571537645640>\n<a:fakerShush:1261673412128931941> MENTIONED POST <a:closeShave:1259834571537645640> 󠀀`;
    return interaction.reply(response);
  },
};
