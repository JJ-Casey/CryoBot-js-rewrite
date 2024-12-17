const { formatEmoji, hyperlink } = require("discord.js");
const Bot = require("../../../../Bot.js");
const utils = require("../../../utils/discordUtils.js");

const red_siren = formatEmoji("1245176572802236458", true);
const blue_siren = formatEmoji("1245176570448973844", true);

function getArtworkMessageLink(ID) {
  return `https://discord.com/channels/724753586461868132/731185708580208650/${ID}`;
}

const pings = `<@&753647463138721822> <@&731177392760029205> <@&884501719810183179> <@&993177661532803142>`

module.exports = {
  eventName: "artworkReported",
  callback: async (bot, messageId, member, reason) => {
    // Send the reported message
    bot.channels.fetch("1317213747856539712").then((channel) => {
      channel.send(
        `A ${hyperlink(
          "post",
          getArtworkMessageLink(messageId)
        )} has been reported to be **${reason}** by ${member}`
      );
    });

    bot.database.query(
      "SELECT COUNT(1) FROM artworkReport WHERE submissionId=?",
      [messageId],
      (err, results) => {
        if (err) {
          return utils.raiseError(bot, err);
        }

        bot.database.query(
          "SELECT moderationKEY, reported FROM artworkModeration WHERE submissionId=?",
          [messageId],
          (err1, results1) => {
            let message;
            if (results1.length == 0) {
              bot.database.query(
                "INSERT INTO artworkModeration (submissionId) VALUES (?)",
                [messageId]
              );
            } else if (results1[0]["reported"] == 0) {
              if (results[0]["COUNT(1)"] >= 2) {
                // message with ping
                bot.database.query(
                  "UPDATE artworkModeration SET reported=1 WHERE submissionId=?",
                  [messageId]
                );

                message = `${pings} ${red_siren}${blue_siren} A ${hyperlink(
                  "post",
                  getArtworkMessageLink(messageId)
                )} needs moderating ${blue_siren}${red_siren} **ID[${
                  results1[0]["moderationKEY"]
                }]**`;
              }
            } else {
              message = `${red_siren}${blue_siren} A ${hyperlink(
                "post",
                getArtworkMessageLink(messageId)
              )} needs moderating ${blue_siren}${red_siren} **ID[${
                results1[0]["moderationKEY"]
              }]**`;
            }

            bot.channels.fetch("1317213747856539712").then((channel) => {
              channel.send(message);
            });
          }
        );
      }
    );
  },
};
