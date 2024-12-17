const {
  Interaction,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  hyperlink,
} = require("discord.js");
const { URL } = require("url");
const Bot = require("../../../../Bot.js");
const utils = require("../../../utils/discordUtils.js");
const { link } = require("fs");

const pepeHeart = "<:pepeheart:765915369206317067>";
const hmmmmApprove = "<:hmmmApprove:1070371737633566742>";

function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch (err) {
    return false;
  }
}

module.exports = {
  eventName: "interactionCreate",
  /**
   *
   * @param {Bot} bot
   * @param {Interaction} interaction
   */
  callback: async (bot, interaction) => {
    if (!interaction.customId) return;
    if (!interaction.isModalSubmit()) return;
    if (!interaction.customId.startsWith("art")) return;

    switch (interaction.customId) {
      case "artSubmissionModal":
        {
          const handle =
            interaction.fields.getTextInputValue("artSubmissionName");
          const source = interaction.fields.getTextInputValue(
            "artSubmissionSource"
          );
          const link =
            interaction.fields.getTextInputValue("artSubmissionLink");

          // Do some checks
          if (!isValidUrl(link)) {
            return interaction.reply({
              content: "The link you provided isn't a valid link :(",
              ephemeral: true,
            });
          }

          if (!isValidUrl(source)) {
            return interaction.reply({
              content: "The source you provided isn't a valid link :(",
              ephemeral: true,
            });
          }

          const embed = utils
            .getDefaultMessageEmbed(bot)
            .setAuthor({
              name: interaction.member.displayName,
              iconURL: interaction.member.displayAvatarURL({ dynamic: true }),
            })
            .setDescription(
              `Submitted by ${interaction.member}\n
              Be aware that sources *may* contain NSFW content, and always check that the link is something you trust before clicking on it.
              \n
              A copy of the link is in the footer of this embed.`
            )
            .addFields(
              {
                name: "Artist Name/Handle",
                value: handle,
                inline: true,
              },
              {
                name: "Source",
                value: hyperlink("Link to source", source),
                inline: true,
              }
            )
            .setImage(link)
            .setFooter({ text: source });

          const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
              .setCustomId(`artReport`)
              .setLabel("Report Submission")
              .setStyle(ButtonStyle.Danger)
          );

          await bot.channels.fetch("731185708580208650").then((channel) =>
            channel
              .send({ embeds: [embed], components: [row] })
              .then((message) => {
                message.react(pepeHeart);
                message.react(hmmmmApprove);

                interaction
                  .reply({
                    content: hyperlink("Go to submission", message.url),
                    ephemeral: true,
                  })
                  .then(utils.deleteNoError(5 * 1000));
              })
          );
        }
        break;
    }
  },
};
