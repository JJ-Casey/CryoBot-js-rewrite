const {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
} = require("discord.js");
const Bot = require("../../../Bot");
const { Random } = require("random-js");
const colors = require("../../utils/colors.js");
const utils = require("../../utils/discordUtils.js");

choices = ["🙌 JJ is best admin 🙌", "🙌 Cat is best admin 🙌"];
module.exports = {
  name: "admin",
  aliases: ["admins", "bestadmin"],
  hidden: false,
  permissions: [],
  usage: "admin",
  description: "Displays who is the best admin",
  category: "Standard Commands",

  slash: new SlashCommandBuilder()
    .setName("admin")
    .setDescription("Displays which admin is best"),

  /**
   * @param {Bot} bot
   * @param {ChatInputCommandInteraction} interaction
   */
  run: async (bot, interaction) => {
    const embed = utils
      .getDefaultMessageEmbed(bot, { title: "Best Admin" })
      .setDescription(`${new Random().pick(choices)}`);
    return interaction.reply({ embeds: [embed] });
  },
};
