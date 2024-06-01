const {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  PermissionFlagsBits,
} = require("discord.js");
const Bot = require("../../../Bot.js");
const colors = require("../../utils/colors.js");
const utils = require("../../utils/discordUtils.js");

module.exports = {
  name: "jail",
  hidden: false,
  permissions: [],
  usage: "jail [user]",
  description: "Sends the user to the gulag",
  category: "Mod Commands",

  slash: new SlashCommandBuilder()
    .setName("jail")
    .setDescription("Sends the user to the gulag")
    .addUserOption((option) =>
      option
        .setName("target")
        .setDescription("The user to jail")
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  /**
   * @param {Bot} bot
   * @param {ChatInputCommandInteraction} interaction
   */
  run: async (bot, interaction) => {
    // Give user jailed role
    // jail 812742522194493440
    // on trial 813938638709719050

    var target = interaction.options.getUser("target");
    interaction.guild.members.fetch(target.id).then((member) => {
      member.roles.add("734397664833175642");

      const embed = utils
        .getDefaultMessageEmbed(bot, {
          title: "Jail",
          description: `User ${member} has been jailed`,
        })
        .setThumbnail(member.avatar_url);
      interaction.reply({ embeds: [embed] });
    });
  },
};
