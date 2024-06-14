const {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
} = require("discord.js");
const Bot = require("../../../Bot");
const utils = require("../../utils/discordUtils.js");

module.exports = {
  name: "joined",
  usage: "joined (member)",
  hidden: false,
  permissions: [],
  description: "Displays when a member joined",
  category: "Standard Commands",

  slash: new SlashCommandBuilder()
    .setName("joined")
    .setDescription(
      "Displays when a member joined! (Defaults to the join date of the command user)"
    )
    .addUserOption((option) =>
      option
        .setName("target")
        .setDescription("The member to find out the joined date of")
    ),

  /**
   * @param {Bot} bot
   * @param {ChatInputCommandInteraction} interaction
   */
  run: async (bot, interaction) => {
    let target = interaction.options.getMember("target") ?? interaction.member;

    var joined = new Date(target.joinedAt.toDateString());

    if (target.id === "389919560607858688") {
      // Noah
      date = Date();
      date.setDate(20);
      date.setMonth(6);
      date.setFullYear(2020);
      joined = Date(2020, 7, 20);
    }

    const embed = utils
      .getDefaultMessageEmbed(bot, { title: "Joined" })
      .setDescription(`${target} joined on ${joined.toDateString()}`)
      .setThumbnail(target.displayAvatarURL({ dynamic: true }));
    return interaction.reply({ embeds: [embed] });
  },
};
