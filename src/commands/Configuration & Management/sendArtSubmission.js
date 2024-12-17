const {
  ChatInputCommandInteraction,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  ButtonBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ButtonStyle,
  SlashCommandBuilder,
  PermissionFlagsBits,
  formatEmoji,
  hyperlink,
} = require("discord.js");
const Bot = require("../../../Bot");
const { ownerID } = require("../../../config.json");
const colors = require("../../utils/colors.js");
const perms = require("../../utils/perms.js");
const utils = require("../../utils/discordUtils.js");

module.exports = {
  name: "sendArtSubmission",
  hidden: false,
  permissions: [perms.checkIsOwner()],
  usage: "sendartsub [channel]",
  description: "Send the Art Submission Message",
  category: "Configuration & Management",

  slash: new SlashCommandBuilder()
    .setName("send-art-submission")
    .setDescription("Send Art Submission Message")
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("The channel to send the submission message to")
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  /**
   * @param {Bot} bot
   * @param {ChatInputCommandInteraction} interaction
   */
  run: async (bot, interaction) => {
    if (interaction.member.id !== ownerID) {
      return;
    }

    var target_channel = interaction.options.getChannel("channel");

    const embed = utils
      .getDefaultMessageEmbed(bot)
      .setTitle("Artwork Submission")
      .setDescription(
        "Please provide all of the information requested in the pop up menu after clicking the `submit` button.\nThe required information is:"
      )
      .addFields(
        {
          name: "Artist Name/handle",
          value: "The name, username, or online handle of the artist",
        },
        {
          name: "Source",
          value: "The source of where you got this artwork from.",
        },
        {
          name: "A link to the art/image itself",
          value: "A direct link to the art/image.",
        }
      );
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("artSubmit")
        .setLabel("Submit")
        .setStyle(ButtonStyle.Success)
    );

    target_channel.send({ embeds: [embed], components: [row] }).then((m) => {
      interaction
        .reply({ content: "Sent!", ephemeral: true })
        .then(utils.deleteNoError(5 * 1000));
    });
  },
};
