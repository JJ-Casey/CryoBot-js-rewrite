const {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  Collection,
  PermissionFlagsBits,
} = require("discord.js");
const Bot = require("../../../Bot");
const colors = require("../../utils/colors.js");
const perms = require("../../utils/perms.js");
const utils = require("../../utils/discordUtils.js");

module.exports = {
  name: "impale",
  usage: "impale [user]",
  hidden: false,
  permissions: [],
  description: "Sends someone to the shadow realm",
  category: "Personal Commands",

  slash: new SlashCommandBuilder()
    .setName("impale")
    .setDescription("Sends someone to the shadow realm")
    .addUserOption((option) =>
      option
        .setName("target")
        .setDescription("The poor soul being impaled")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option.setName("reason").setDescription("The reason for their impalement")
    ),
  // .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

  /**
   * @param {Bot} bot
   * @param {ChatInputCommandInteraction} interaction
   */
  run: async (bot, interaction) => {
    // Mitzy, Luxx, and JJ
    let allowed_users = ["539443960813191179", "235467134581342208"];

    if (!allowed_users.includes(interaction.user.id)) {
      const responseEmbed = utils.getDefaultMessageEmbed(bot, {
        title: "Nuh uh",
        description: "You're not Luxxi...",
        color: colors.FireBrick,
      });
      return interaction.reply({ embeds: [responseEmbed], ephemeral: true });
    }

    const target = interaction.options.getUser("target");
    const reason =
      interaction.options.getString("reason") ??
      "Mitzy was too hungry to give a reason...";

    if (target.id == interaction.member.id) {
      const responseEmbed = utils.getDefaultMessageEmbed(bot, {
        title: "Why?",
        description: "What a weirdo <a:Classic:1214903208284262412>",
        color: colors.FireBrick,
      });
      return interaction.reply({ embeds: [responseEmbed], ephemeral: true });
    }

    const memb = await interaction.guild.members.fetch(target);

    if (utils.checkIsUnmoderatable(memb)) {
      const responseEmbed = utils.getDefaultMessageEmbed(bot, {
        title: "Nuh uh",
        color: colors.FireBrick,
      });
      return interaction.reply({ embeds: [responseEmbed], ephemeral: true });
    }

    // ban
    // await interaction.guild.members.ban(target);

    const responseEmbed = utils.getDefaultMessageEmbed(bot, {
      title: "",
      description: "Mitzy has claimed another soul!",
      color: colors.FireBrick,
    });

    // 398957705294774272
    interaction.guild.members.fetch("235467134581342208").then((mitzy) => {
      responseEmbed.setThumbnail(mitzy.displayAvatarURL({ dynamic: true }));
      interaction.reply({ embeds: [responseEmbed] });

      const logEmbed = utils.getDefaultMessageEmbed(bot, {
        title: "",
        description: "Mitzy has claimed another soul!",
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
            .get(`${interaction.guildId}`)
            .channels.cache.get(result[0].channelId)
            .send({ embeds: [logEmbed] });
        }
      );
    });
  },
};
