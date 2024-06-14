const {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  PermissionFlagsBits,
} = require("discord.js");
const Bot = require("../../../Bot.js");
const { ownerID } = require("../../../config.json");
const utils = require("../../utils/discordUtils.js");

module.exports = {
  name: "court",
  hidden: false,
  permissions: [],
  usage: "court [user]",
  description: "Takes the user to court",
  category: "Mod Commands",

  slash: new SlashCommandBuilder()
    .setName("court")
    .setDescription("Takes the user to court")
    .addUserOption((option) =>
      option
        .setName("target")
        .setDescription("The user to take to court")
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
      if (!member.roles.cache.some((role) => role.id == "734397664833175642")) {
        return interaction.reply({
          content: "That user isn't jailed, stupid!",
          ephemeral: true,
        });
      }

      member.roles.add("734397664833175642");
      interaction.guild.channels.fetch("733676206943371297").then((channel) => {
        interaction.reply({
          content: `Done! Go to ${channel}`,
          ephemeral: true,
        });
        channel.send(
          `${member}, you are now in court! This is your chance to appeal your Jailing.`
        );
      });
    });
  },
};
