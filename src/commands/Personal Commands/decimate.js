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
  name: "decimate",
  usage: "decimate [user]",
  hidden: false,
  permissions: [],
  description: "Sends someone to the shadow realm",
  category: "Personal Commands",

  slash: new SlashCommandBuilder()
    .setName("decimate")
    .setDescription("Sends someone to the shadow realm")
    .addUserOption((option) =>
      option
        .setName("target")
        .setDescription("The poor soul being decimated")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option.setName("reason").setDescription("The reason for their decimation")
    ),
  // .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

  /**
   * @param {Bot} bot
   * @param {ChatInputCommandInteraction} interaction
   */
  run: async (bot, interaction) => {
    // Luxx and JJ
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
      "Luxx did not feel they were deserving of a reason...";

    if (target.id == interaction.member.id) {
      const responseEmbed = utils.getDefaultMessageEmbed(bot, {
        title: "Why?",
        // hairdryer
        description: "What a weirdo <a:Classic:1214903208284262412>",
        color: colors.FireBrick,
      });
      return interaction.reply({ embeds: [responseEmbed], ephemeral: true });
    }

    const memb = await interaction.guild.members.fetch(target);

    if (utils.checkIsUnmoderatable(memb)) {
      const responseEmbed = utils
        .getDefaultMessageEmbed(bot, {
          title: "Nuh uh",
          color: colors.FireBrick,
        })
        .setImage("https://cdn.imgchest.com/files/3yrgca95d94.gif");
      return interaction.reply({ embeds: [responseEmbed] });
    }

    // ban
    // await interaction.guild.members.ban(target);

    const responseEmbed = utils
      .getDefaultMessageEmbed(bot, {
        title: "",
        description: "Luxx has decimated another mortal!",
        color: colors.FireBrick,
      })
      .addFields({
        name: utils.emptyEmbed,
        value: `**Reason:** ${reason}`,
      });

    const gifs = [
      "https://media.tenor.com/kQryFMu7fhoAAAAC/rezero-rem.gif",
      "https://media.tenor.com/XQiSjsnR2g8AAAAC/rem-re-zero.gif",
      "https://media1.tenor.com/m/o4ReLVIi2osAAAAC/re-zero-anime.gif",
      "https://cdn.imgchest.com/files/b49zc9vk8ay.gif",
      "https://cdn.imgchest.com/files/myd5cgmznj4.gif",
      "https://cdn.imgchest.com/files/myd5cgmzwm4.gif",
    ];
    const gif_to_send = new Random().pick(gifs);

    // 539443960813191179
    interaction.guild.members.fetch("539443960813191179").then((luxx) => {
      responseEmbed.setThumbnail(luxx.displayAvatarURL({ dynamic: true }));
      responseEmbed.setImage(gif_to_send);
      interaction.reply({ embeds: [responseEmbed] });

      const logEmbed = utils.getDefaultMessageEmbed(bot, {
        title: "",
        description: "Luxx has decimated another mortal!",
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
