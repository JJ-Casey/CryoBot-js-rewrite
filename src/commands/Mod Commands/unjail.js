const {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  PermissionFlagsBits,
} = require("discord.js");
const Bot = require("../../../Bot.js");
const { ownerID } = require("../../../config.json");
const utils = require("../../utils/discordUtils.js");

module.exports = {
  name: "unjail",
  hidden: false,
  permissions: [],
  usage: "unjail [user]",
  description: "Removes the user from the gulag",
  category: "Mod Commands",

  slash: new SlashCommandBuilder()
    .setName("unjail")
    .setDescription("Remove the user from the gulag")
    .addUserOption((option) =>
      option
        .setName("target")
        .setDescription("The user to unjail")
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
      member.roles.remove("734397664833175642");

      const embed = utils
        .getDefaultMessageEmbed(bot, {
          title: "Jail",
          description: `User ${member} has been released from jail`,
        })
        .setThumbnail(member.avatar_url);
      interaction.reply({ embeds: [embed] });
    });
  },
};
