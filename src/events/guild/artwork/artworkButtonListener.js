const {
  Interaction,
  ActionRowBuilder,
  ChatInputCommandInteraction,
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
const Bot = require("../../../../Bot.js");
const utils = require("../../../utils/discordUtils.js");

function getArtworkMessageLink(ID) {
  return `https://discord.com/channels/724753586461868132/731185708580208650/${ID}`;
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
    if (!interaction.isButton()) return;
    if (!interaction.customId.startsWith("art")) return;

    const tokens = interaction.customId.split("-");
    const customId = tokens[0];

    switch (customId) {
      case "artSubmit":
        {
          // Construct the modal
          const modal = new ModalBuilder()
            .setCustomId("artSubmissionModal")
            .setTitle("Artwork Submission");

          const artistName = new TextInputBuilder()
            .setCustomId("artSubmissionName")
            .setLabel("Artist Name/Handle")
            .setStyle(TextInputStyle.Short)
            .setPlaceholder("The artist's name/online handle")
            .setRequired(true);

          const artworkSource = new TextInputBuilder()
            .setCustomId("artSubmissionSource")
            .setLabel("Source Site")
            .setStyle(TextInputStyle.Paragraph)
            .setMaxLength(300)
            .setPlaceholder("The post/collection the artwork is from")
            .setRequired(true);

          const artworkLink = new TextInputBuilder()
            .setCustomId("artSubmissionLink")
            .setLabel("Image Link")
            .setStyle(TextInputStyle.Paragraph)
            .setMaxLength(300)
            .setPlaceholder(
              "A direct link to the image (discord should be able to display the link as an image)"
            )
            .setRequired(true);

          const nameAR = new ActionRowBuilder().addComponents(artistName);
          const sourceAR = new ActionRowBuilder().addComponents(artworkSource);
          const linkAR = new ActionRowBuilder().addComponents(artworkLink);

          modal.addComponents(nameAR, sourceAR, linkAR);

          interaction.showModal(modal);
        }
        break;
      case "artReport":
        // Send an ephemeral message to the user to report the submission
        const message =
          "Please select the reason for reporting this submission. You can hide or ignore this message to cancel the report.";

        const row = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId(`artReportNSFW-${interaction.message.id}`)
            .setLabel("NSFW")
            .setStyle(ButtonStyle.Danger),
          new ButtonBuilder()
            .setCustomId(`artReportInappropriate-${interaction.message.id}`)
            .setLabel("Inappropriate")
            .setStyle(ButtonStyle.Primary),
          new ButtonBuilder()
            .setCustomId(`artReportBrokenLink-${interaction.message.id}`)
            .setLabel("Broken Link")
            .setStyle(ButtonStyle.Secondary),
          new ButtonBuilder()
            .setCustomId(`artReportScamLink-${interaction.message.id}`)
            .setLabel("Scam Link")
            .setStyle(ButtonStyle.Danger)
        );
        interaction
          .reply({
            content: message,
            components: [row],
            ephemeral: true,
          })
          .then(utils.deleteNoError(30 * 1000));
        break;
      case "artReportNSFW":
        bot.database.query(
          "SELECT COUNT(1) FROM artworkReport WHERE memberId=? AND submissionId=?",
          [interaction.user.id, tokens[1]],
          (err, results) => {
            if (err) {
              return utils.raiseError(bot, err);
            }

            if (results[0]["COUNT(1)"] == 0) {
              bot.database.query(
                "INSERT INTO artworkReport (memberId, submissionId, reportReason) VALUES (?,?,?)",
                [interaction.user.id, tokens[1], "NSFW"],
                (err1, results1) => {
                  if (err1) {
                    return utils.raiseError(bot, err1);
                  }
                  interaction
                    .update({
                      content: "You chose: NSFW",
                      components: [],
                      ephemeral: true,
                    })
                    .then(utils.deleteNoError(15 * 1000))
                    .then(() => {
                      bot.emit(
                        "artworkReported",
                        tokens[1],
                        interaction.member,
                        "NSFW"
                      );
                    });
                }
              );
            } else {
              interaction
                .update({
                  content: "You have already reported this post!",
                  components: [],
                  ephemeral: true,
                })
                .then(utils.deleteNoError(15 * 1000));
            }
          }
        );
        break;
      case "artReportInappropriate":
        bot.database.query(
          "SELECT COUNT(1) FROM artworkReport WHERE memberId=? AND submissionId=?",
          [interaction.user.id, tokens[1]],
          (err, results) => {
            if (err) {
              return utils.raiseError(bot, err);
            }

            if (results[0]["COUNT(1)"] == 0) {
              bot.database.query(
                "INSERT INTO artworkReport (memberId, submissionId, reportReason) VALUES (?,?,?)",
                [interaction.user.id, tokens[1], "INNAPROPRIATE"],
                (err1, results1) => {
                  if (err1) {
                    return utils.raiseError(bot, err1);
                  }
                  interaction
                    .update({
                      content: "You chose: Inappropriate",
                      components: [],
                      ephemeral: true,
                    })
                    .then(utils.deleteNoError(15 * 1000))
                    .then(() => {
                      bot.emit(
                        "artworkReported",
                        tokens[1],
                        interaction.member,
                        "Inappropriate"
                      );
                    });
                }
              );
            } else {
              interaction
                .update({
                  content: "You have already reported this post!",
                  components: [],
                  ephemeral: true,
                })
                .then(utils.deleteNoError(15 * 1000));
            }
          }
        );
        break;
      case "artReportBrokenLink":
        bot.database.query(
          "SELECT COUNT(1) FROM artworkReport WHERE memberId=? AND submissionId=?",
          [interaction.user.id, tokens[1]],
          (err, results) => {
            if (err) {
              return utils.raiseError(bot, err);
            }

            if (results[0]["COUNT(1)"] == 0) {
              bot.database.query(
                "INSERT INTO artworkReport (memberId, submissionId, reportReason) VALUES (?,?,?)",
                [interaction.user.id, tokens[1], "BROKEN"],
                (err1, results1) => {
                  if (err1) {
                    return utils.raiseError(bot, err1);
                  }
                  interaction
                    .update({
                      content: "You chose: Broken Link",
                      components: [],
                      ephemeral: true,
                    })
                    .then(utils.deleteNoError(15 * 1000))
                    .then(() => {
                      bot.emit(
                        "artworkReported",
                        tokens[1],
                        interaction.member,
                        "Broken Link"
                      );
                    });
                }
              );
            } else {
              interaction
                .update({
                  content: "You have already reported this post!",
                  components: [],
                  ephemeral: true,
                })
                .then(utils.deleteNoError(15 * 1000));
            }
          }
        );
        break;
      case "artReportScamLink":
        bot.database.query(
          "SELECT COUNT(1) FROM artworkReport WHERE memberId=? AND submissionId=?",
          [interaction.user.id, tokens[1]],
          (err, results) => {
            if (err) {
              return utils.raiseError(bot, err);
            }

            if (results[0]["COUNT(1)"] == 0) {
              bot.database.query(
                "INSERT INTO artworkReport (memberId, submissionId, reportReason) VALUES (?,?,?)",
                [interaction.user.id, tokens[1], "SCAM"],
                (err1, results1) => {
                  if (err1) {
                    return utils.raiseError(bot, err1);
                  }
                  interaction
                    .update({
                      content: "You chose: Scam Link",
                      components: [],
                      ephemeral: true,
                    })
                    .then(utils.deleteNoError(15 * 1000))
                    .then(() => {
                      bot.emit(
                        "artworkReported",
                        tokens[1],
                        interaction.member,
                        "Scam Link"
                      );
                    });
                }
              );
            } else {
              interaction
                .update({
                  content: "You have already reported this post!",
                  components: [],
                  ephemeral: true,
                })
                .then(utils.deleteNoError(15 * 1000));
            }
          }
        );
        break;
    }
  },
};
