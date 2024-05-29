const {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
} = require("discord.js");
const Bot = require("../../../Bot");
const { Random } = require("random-js");
const utils = require("../../utils/discordUtils.js");

mods = [
  "Nosp",
  "Mitzy",
  "Noah",
  "Lens",
  "Luxx",
  "Aj",
  "Daika",
  "Nasch",
  "Bas",
  "Grim",
  "Light",
];
mods_nolight = [
  "Nosp",
  "Mitzy",
  "Noah",
  "Lens",
  "Luxx",
  "Aj",
  "Daika",
  "Nasch",
  "Bas",
  "Grim",
];

/**
 * If light is picked, edit the message after a few seconds and choose someone else
 */
module.exports = {
  name: "mod",
  aliases: ["BestMod", "bestMod", "bestmod"],
  hidden: false,
  permissions: [],
  usage: "mod",
  description: "Displays who is the best moderator",
  category: "Standard Commands",

  slash: new SlashCommandBuilder()
    .setName("mod")
    .setDescription("Displays who is the best moderator"),

  /**
   * @param {Bot} bot
   * @param {ChatInputCommandInteraction} interaction
   */
  run: async (bot, interaction) => {
    const embed = utils.getDefaultMessageEmbed(bot, { title: "Best Mod" });
    choice = new Random().pick(mods);
    embed.setDescription(`🙌 ${choice} is best mod 🙌`);
    interaction.reply({ embeds: [embed] });

    if (choice == "Light") {
      function pick_again() {
        choice = new Random().pick(mods_nolight);
        embed.setDescription(`🙌 ${choice} is best mod 🙌`);
        interaction.editReply({ embeds: [embed] });
      }
      setTimeout(pick_again, 4 * 1000);
    }
  },
};
