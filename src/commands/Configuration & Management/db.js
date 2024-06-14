const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const Bot = require("../../../Bot");
const { ownerID } = require("../../../config.json");
const colors = require("../../utils/colors.js");
const utils = require("../../utils/discordUtils.js");
const perms = require("../../utils/perms.js");

module.exports = {
  name: "db",
  hidden: true,
  permissions: [perms.checkIsOwner()],
  usage: "db [SQL Query]",
  description: "Execute SQL code to interact with the database.",
  category: "Configuration & Management",

  slash: new SlashCommandBuilder()
    .setName("db")
    .setDescription("Use SQL magic with the super secret database")
    .addStringOption((option) =>
      option
        .setName("query")
        .setDescription("The SQL query to execute")
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  /**
   * @param {Bot} bot
   * @param {Message} message
   * @param {string[]} args
   */
  run: async (bot, interaction) => {
    if (interaction.member.id !== ownerID) {
      return;
    }

    const query = interaction.options.getString("query");
    bot.database.query(query, function (err, result) {
      if (err) {
        const embed = utils
          .getDefaultMessageEmbed(bot, {
            title: "Error",
            color: colors.FireBrick,
          })
          .setDescription(`${err}`)
          .addFields({ name: "Query", value: `Parsed query: ${query}` });

        return interaction.reply({ embeds: [embed] }).then((msg) => {
          setTimeout(() => msg.delete(), 5000);
        });
      }

      const embed = utils
        .getDefaultMessageEmbed(bot, { title: "Database Query" })
        .addFields({ name: "Query", value: `Parsed query: \`${query}\`` })
        .addFields({
          name: utils.emptyEmbed,
          value: `Everything seems to be good <:hmmmApprove:1070371737633566742>`,
        });

      // if (result.message) {
      //   embed.addFields({
      //     name: "Message",
      //     value: `DB Message: ${result.message}`,
      //   });
      // } else {
      //   try {
      //     result.forEach((row) => {
      //       let val = "For Each:\n";
      //       for (let key in row) val += `**${key}**: ${row[key]}\n`;
      //       embed.addFields({ name: "Row", value: `Value: ${val}` });
      //     });
      //   } catch {
      //     let val = "";
      //     for (let key in result) val += `**${key}**: ${result[key]}\n`;
      //     embed.addFields({ name: "Row", value: `Value: ${val}` });
      //   }
      // }

      return interaction.reply({ embeds: [embed] });
    });
  },
};
