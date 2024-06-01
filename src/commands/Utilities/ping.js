const {
  ChatInputCommandInteraction,
  PermissionFlagsBits,
  SlashCommandBuilder,
} = require("discord.js");
const Bot = require("../../../Bot");
const perms = require("../../utils/perms");
const utils = require("../../utils/discordUtils.js");
const { stripIndents } = require("common-tags");

module.exports = {
  name: "ping",
  aliases: ["pingu", "pong"],
  hidden: false,
  permissions: [perms.checkIsAdministrator()],
  usage: "ping",
  description:
    "Checks the latency of the bot and message latency, and checks if bot is on",
  category: "Utilities",

  slash: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Display network reponse times of the bot"),

  /**
   * @param {Bot} bot
   * @param {ChatInputCommandInteraction} interaction
   */
  run: async (bot, interaction) => {
    interaction
      .reply({ content: "Pinging...", fetchReply: true })
      .then((reply) => {
        const embed = utils.getDefaultMessageEmbed(bot).setTitle("Pong!");

        embed.addFields(
          {
            name: "Latency",
            value: `${Math.floor(reply.createdAt - interaction.createdAt)}ms`,
            inline: true,
          },
          { name: "Discord API Latency", value: `${bot.ws.ping}ms` }
        );
        interaction.editReply({ content: "", embeds: [embed] });
      });
  },
};
