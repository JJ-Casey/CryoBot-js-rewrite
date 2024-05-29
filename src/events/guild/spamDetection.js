const { Message, Events, parseEmoji, formatEmoji } = require("discord.js");
const Bot = require("../../../Bot");
const utils = require("../../utils/discordUtils.js");
const perms = require("../../utils/perms.js");

const spam_amount = 3;
const spam_threshold = 0.5;
const red_siren = formatEmoji("1245176572802236458", true);
const blue_siren = formatEmoji("1245176570448973844", true);

module.exports = {
  eventName: Events.MessageCreate,
  /**
   *
   * @param {Bot} bot
   * @param {Message} message
   */
  callback: async (bot, message) => {
    const member = message.member;
    const author = message.author;

    // if (perms.checkIsOwner(member)) {
    //   return;
    // }

    // const unmoderateable_roles = [
    //   "Some dude",
    //   "Admin",
    //   "Mod",
    //   "Soul Wardens",
    //   "Bots",
    //   //   "@everyone",
    // ]; // Change to IDs?

    // const memb = await interaction.guild.members.fetch(target);
    // const target_role_intersection = memb.roles.cache
    //   .map((role) => role.name)
    //   .filter((rName) => unmoderateable_roles.includes(rName));

    // if (target_role_intersection.length > 0) {
    //   return;
    // }

    if (author.bot || !message.guild) {
      return;
    }

    const serverId = message.guildId;
    const timestamp = message.createdTimestamp;

    bot.database.query(
      "SELECT memberKEY FROM members WHERE serverId=? AND memberId=? AND bot=0",
      [serverId, author.id],
      function (err, result) {
        if (err) {
          return utils.raiseError(bot, err);
        }

        const memberKEY = result[0]["memberKEY"];

        bot.database.query(
          "INSERT INTO messageModeration (memberKEY, content, timestamp) VALUES (?,?,?)",
          [memberKEY, message.content, timestamp],
          function (err2, result2) {
            if (err2) {
              console.log(JSON.stringify(err2));
              return utils.raiseError(bot, err2);
            }
            bot.database.query(
              "SELECT content, timestamp FROM messageModeration WHERE memberKEY=? ORDER BY timestamp DESC LIMIT ?",
              [memberKEY, spam_amount],
              function (err3, results) {
                if (!results || results.length < spam_amount) {
                  return;
                }
                var punish = false;

                // Checks for too many messages sent at the same time
                // Converts the timestamps to seconds and takes the differences
                var timestamps = results.map((row) => row["timestamp"] / 1000);
                var timediffs = [];

                for (var i = 0; i < results.length - 1; i++) {
                  timediffs.push(timestamps[i] - timestamps[i + 1]);
                }

                const sum = timediffs.reduce((a, b) => a + b, 0);
                const avg = sum / timediffs.length || -1;
                punish |= avg < spam_threshold && avg != -1;

                // Checks for the same message sent multiple times
                var contents = results.map((row) => row["content"]);
                var same_messages = contents.every((x) => x == contents[0]);
                punish |= same_messages & (timediffs[0] < 2 * 1000);

                if (punish) {
                  if (member.communicationDisabledUntilTimestamp > Date.now()) {
                    // don't double stack timeouts/messages
                    return;
                  }
                  message.channel.send(
                    `${red_siren}${blue_siren} Hey, ${author}! Quit your yapping! ${blue_siren}${red_siren}\n(Spam detected)`
                  );
                  const timeout_time = Date.now();
                  // .then(() => {
                  bot.database.query(
                    "INSERT INTO moderation (memberKEY, timeout, whentimeout) VALUES (?,?,?) ON DUPLICATE KEY UPDATE whentimeout=?, timeoutDiff=?-whentimeout, numTimeouts=numTimeouts+1",
                    [memberKEY, 1, timeout_time, timeout_time, timeout_time],
                    function (err4, results4) {
                      if (err4) {
                        console.log(JSON.stringify(err4));
                        return utils.raiseError(bot, err4);
                      }
                      bot.database.query(
                        "SELECT numTimeouts FROM moderation WHERE memberKEY=?",
                        [memberKEY],
                        function (err5, results5) {
                          if (err5) {
                            console.log(JSON.stringify(err5));
                            return utils.raiseError(bot, err5);
                          }
                          const numTimeouts = Number(
                            results5[0]["numTimeouts"]
                          );
                          const timeoutDuration = 2 ** numTimeouts * 1000;
                          console.log(
                            `Timing out for ${timeoutDuration / 1000} seconds`
                          );
                          member
                            .timeout(timeoutDuration, (reason = "Yapping"))
                            .then(() => {
                              console.log("Success!");
                            })
                            .catch((err) => {
                              console.log(
                                `Oops, tried to mod ${author.displayName} (ID: ${author.id}) and I don't have permission to do so!`
                              );
                            });
                        }
                      );
                    }
                  );
                }
              }
            );
          }
        );
      }
    );

    // if (message.member.id == "235467134581342208") {
    //     // Add message/hashed message to db w/ timestamp
    //     // Check the last 5 messages
    //   message.reply(
    //     "<a:siren_red:1245176572802236458><a:siren_blue:1245176570448973844> SHUT UP <a:siren_blue:1245176570448973844><a:siren_red:1245176572802236458>"
    //   );
    // }
  },
};
