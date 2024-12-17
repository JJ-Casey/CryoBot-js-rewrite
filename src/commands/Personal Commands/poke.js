const {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  AttachmentBuilder,
} = require("discord.js");
const Bot = require("../../../Bot");
const utils = require("../../utils/discordUtils.js");

const nami_id = "270944077820854273";

module.exports = {
  name: "poke",
  usage: "poke (user)",
  hidden: false,
  permissions: [],
  description: "Pokes someone",
  category: "Personal Commands",

  slash: new SlashCommandBuilder()
    .setName("poke")
    .setDescription("Pokes someone")
    .addUserOption((option) =>
      option
        .setName("target")
        .setDescription("The member that you want to poke")
    ),

  /**
   * @param {Bot} bot
   * @param {ChatInputCommandInteraction} interaction
   */
  run: async (bot, interaction) => {
    interaction.channel.sendTyping();
    const embed = utils.getDefaultMessageEmbed(bot);

    let author = interaction.member;
    let target = interaction.options.getMember("target");

    let desc = "";
    if (author.id == nami_id) {
      if (target != null) {
        if (target.id == nami_id) {
          desc = `${author} hurt themselves in confusion!`;
        } else {
          desc = `${author} climbs out of their pond to poke ${target}`;
        }
      } else {
        desc = `${message.author} climbs out of their pond to assert dominance`;
      }
    } else {
      if (target != null) {
        if (target.id == author.id) {
          desc = `${author} hurt themselves in confusion!`;
        } else {
          desc = `${author} steals Nami\'s staff to poke ${target}`;
        }
      } else {
        desc = `${author} steals Nami\'s staff. Give it back <:pepeHmmm:768807772548497420>`;
      }
    }

    embed.setImage("https://i.imgur.com/Q9V1ED5.gif");
    embed.setDescription(desc);

    interaction.reply({ embeds: [embed] });
  },
};
