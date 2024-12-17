const { Message } = require("discord.js");
const { ownerID } = require("../../../../config.json");
const Bot = require("../../../../Bot");
const { Random } = require("random-js");
const fs = require("fs");

const prob_grr = 0.05;
const prob_timeout = 0.005;

const responses = [
  "You diddily ding dong done fucked up by mentioning me in your riddly-reply or message! You diddily ding dong done gone got yourself a riddly-random timeout!",
  "Yousa done fucked tup by mentionen mesa in yous replyen or message! yousa done gone got yourself a random timeout!",
  "You have ponged your last ping!",
  "Fucked up by mentioning me in your reply or message you have! Gone got yourself a random timeout you have!",
  "You are a do fucked upon by mentioning my on yours reply or message! you are a do go keep yourself that random timeout!",
  "You donye fucked up by mentionying me in youw wepwy ow (・`ω´・) message!!11 You donye gonye got youwsewf *notices buldge* a wandom timeout?!!",
];

const rebeccaYes = "<:rebeccayes:1296261178712129567>";
const rebeccaNo = "<:rebeccano:1296261177206112256>";
const thinkge = "<a:thinkge:1300514927467040788>";
const thinking = "<:thinking:1070744953547923516>";
const thinking2 = "<:thinking2:1070744955053674496>";
const ppdvd = "<a:ppdvd:1070744958677557318>";
const MMMMok = "<:MMMMok:1070371749872553996>";
const saitama = "<a:saitama:897923430429626439>";
const hmmmDisapprove = "<:hmmmDisapprove:1070371741731401761>";
const hmmmApprove = "<:hmmmApprove:1070371737633566742>";
const hmmmNotes = "<a:hmmmNotes:1070379980334313522>";
const letsago = "<a:letsago:1070744989610549319>";

const response_type = ["yes", "no", "maybe", "special"];
const eightball_emotes = {
  yes: [rebeccaYes, MMMMok, hmmmApprove],
  no: [rebeccaNo, hmmmDisapprove, saitama],
  maybe: [hmmmNotes, thinkge],
  special: [letsago],
};
const eightball_responses = {
  yes: [
    "It is certain",
    "Without a doubt",
    "Yes, definitely",
    "Most likely",
    "Yes",
  ],
  no: ["Nuh uh", "Nope", "Definitely not", "I doubt it", "No"],
  maybe: [
    "Ask again later",
    "Maybe",
    "It is uncertain",
    "Who knows",
    "Beats me",
  ],
  special: [
    `${thinking}${ppdvd}${thinking2}`,
    "I'm not sure, but Light should wear the maid outfit",
  ],
};

const rng = new Random();

module.exports = {
  eventName: "messageCreate",
  /**
   *
   * @param {Bot} bot
   * @param {Message} message
   */
  callback: async (bot, message) => {
    if (message.author.bot) return;
    if (!message.inGuild()) return;
    if (message.guildId != "724753586461868132") return;
    if (!message.mentions.has(bot.user)) return;

    // Populate Sticker DB
    // bot.database.query(
    //   "SELECT serverKEY,serverID FROM servers",
    //   (err, results) => {
    //     if (err) {
    //       return console.error(err);
    //     }
    //     results.forEach((row) => {
    //       const serverKEY = row["serverKEY"];
    //       const serverID = row["serverID"];
    //       bot.guilds.cache
    //         .get(serverID)
    //         .stickers.fetch()
    //         .then((stickers) => {
    //           stickers.forEach((sticker) => {
    //             bot.database.query(
    //               "INSERT INTO stickers (serverKEY,stickerName,stickerID) VALUES (?,?,?) ON DUPLICATE KEY UPDATE serverKEY=?,stickerName=?",
    //               [
    //                 serverKEY,
    //                 sticker.name,
    //                 sticker.id,
    //                 serverKEY,
    //                 sticker.name,
    //               ],
    //               (err1, results1) => {
    //                 if (err1) {
    //                   return console.error(err1);
    //                 }
    //               }
    //             );
    //           });
    //         });
    //     });
    //   }
    // );

    // Sticker sending
    // if (message.author.id == ownerID) {
    //   bot.database.query(
    //     "SELECT serverID,stickerID FROM serverStickers",
    //     (err, results) => {
    //       const chosenStickerRow = rng.pick(results);
    //       message.reply({
    //         stickers: bot.guilds.cache
    //           .get(chosenStickerRow.serverID)
    //           .stickers.cache.filter((s) => s.id == chosenStickerRow.stickerID),
    //       });
    //     }
    //   );
    //   return;
    // }

    if (message.content.trim().endsWith("?")) {
      // 8Ball
      const question = message.content
        .replace(bot.user.toString(), "")
        .split("?")[0]
        .trim();
      if (question.length == 0) {
        await message.reply({
          content:
            "Try _actually_ asking me a question <:grrrr:1285221952428179487>",
          allowedMentions: { repliedUser: false },
        });
        return;
      }
      let resp_type = rng.pick(response_type);
      let eightball_response = rng.pick(eightball_responses[resp_type]);
      let emoji = rng.pick(eightball_emotes[resp_type]);
      let resp_message = `${eightball_response} ${emoji}`;
      await message.reply({
        content: resp_message,
        allowedMentions: { repliedUser: false },
      });
      return;
    } else {
      const runi = Math.random();

      fs.appendFile("./uniform_values.txt", `${runi.toString()}\n`, (err) => {
        if (err) {
          console.error(err);
        }
      });

      if (runi < prob_timeout) {
        if (message.author.id != ownerID) {
          const member = message.guild.members.cache.get(message.author.id);
          try {
            await message.reply(
              `<a:timeout:1285954712415502388> ${rng.pick(
                responses
              )} <a:timeout:1285954712415502388>`
            );
            await member.timeout(69 * 1000, "Random CBT Mention");
          } catch (e) {}
        }
      } else if (runi < prob_grr) {
        await message.reply("<:grrrr:1285221952428179487>");
      }
    }
  },
};
