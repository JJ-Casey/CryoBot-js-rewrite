const {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  Collection,
  PermissionFlagsBits,
} = require("discord.js");
const Bot = require("../../../Bot");
const colors = require("../../utils/colors.js");
const { Random } = require("random-js");
const perms = require("../../utils/perms.js");
const PermissionError = require("../../utils/permissionError.js");
const utils = require("../../utils/discordUtils.js");

module.exports = {
  name: "yeet",
  usage: "yeet [user]",
  hidden: true,
  permissions: [],
  description: "Yeets someone from the server",
  category: "Mod Commands",

  slash: new SlashCommandBuilder()
    .setName("yeet")
    .setDescription("Yeets someone from the server")
    .addUserOption((option) =>
      option
        .setName("target")
        .setDescription("The person to yeet")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option.setName("reason").setDescription("The reason for yeeting")
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),

  /**
   * @param {Bot} bot
   * @param {ChatInputCommandInteraction} interaction
   */
  run: async (bot, interaction) => {
    const target = interaction.options.getUser("target");
    const reason =
      interaction.options.getString("reason") ?? "No reason needed!";

    if (target.id == interaction.member.id) {
      const responseEmbed = utils.getDefaultMessageEmbed(bot, {
        title: "Why?",
        description: "What a weirdo <a:Classic:1214903208284262412>",
        color: colors.FireBrick,
      });
      return interaction.reply({ embeds: [responseEmbed], ephemeral: true });
    }

    const unkickable_roles = [
      "Some dude",
      "Admin",
      "Mod",
      "Soul Wardens",
      "Bots",
      //   "@everyone",
    ]; // Change to IDs?

    const memb = await interaction.guild.members.fetch(target);
    const target_role_intersection = memb.roles.cache
      .map((role) => role.name)
      .filter((rName) => unkickable_roles.includes(rName));

    if (target_role_intersection.length > 0) {
      const responseEmbed = utils.getDefaultMessageEmbed(bot, {
        title: "Nuh uh",
        color: colors.FireBrick,
      });
      return interaction.reply({ embeds: [responseEmbed], ephemeral: true });
    }

    // kick
    // await interaction.guild.members.kick(target);

    const responseEmbed = utils.getDefaultMessageEmbed(bot, {
      title: "",
      description: "Some idiot was yeeted <a:letsago:1070744989610549319>",
      color: colors.FireBrick,
    });

    interaction.reply({ embeds: [responseEmbed] });

    const logEmbed = utils.getDefaultMessageEmbed(bot, {
      title: "",
      description: "Some idiot was yeeted <a:letsago:1070744989610549319>",
    });
    logEmbed.addFields(
      { name: "User", value: `${target}`, inline: true },
      { name: "Moderator", value: `${interaction.member}`, inline: true },
      { name: "Reason", value: `${reason}`, inline: true }
    );
    logEmbed.setThumbnail(target.displayAvatarURL({ dynamic: true }));

    bot.database.query(
      "SELECT channelId FROM log_channels WHERE logName='BOT_DEBUG' AND serverId=?",
      [interaction.guildId],
      function (err, result) {
        if (err) {
          throw err;
        }
        bot.guilds.cache
          .get("733676009374744707")
          .channels.cache.get(result[0].channelId)
          .send({ embeds: [logEmbed] });
      }
    );
  },
};
