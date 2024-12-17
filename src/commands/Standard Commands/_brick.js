const {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  AttachmentBuilder,
} = require("discord.js");
const Bot = require("../../../Bot.js");
const utils = require("../../utils/discordUtils.js");

const nami_id = "270944077820854273";

module.exports = {
  name: "brick",
  usage: "brick (user)",
  hidden: false,
  permissions: [],
  description: "Bricks someone",
  category: "Standard Commands",

  slash: new SlashCommandBuilder()
    .setName("brick")
    .setDescription("Brick someone")
    .addUserOption((option) =>
      option
        .setName("target")
        .setDescription("The member that you want to brick")
    ),

  /**
   * @param {Bot} bot
   * @param {ChatInputCommandInteraction} interaction
   */
  run: async (bot, interaction) => {
    let author = interaction.member;
    let target = interaction.options.getMember("target");

    let ping;
    if (target != null) {
      ping = `${target}`;
    } else {
      ping = `${author}`;
    }

    bot.database.query(
      "SELECT serverID,stickerID FROM serverStickers WHERE stickerName=?",
      ["peepoBrick"],
      (err, results) => {
        const peepoBrickRow = results[0];
        const peepoBrick = bot.guilds.cache
          .get(peepoBrickRow.serverID)
          .stickers.cache.filter((s) => s.id == peepoBrickRow.stickerID);
        interaction.channel.send({
          content: ping,
          stickers: peepoBrick,
        });
      }
    );
  },
};
