const {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  PermissionFlagsBits,
} = require("discord.js");
const Bot = require("../../../Bot.js");
const { ownerID } = require("../../../config.json");
const utils = require("../../utils/discordUtils.js");

module.exports = {
  name: "adjourned",
  hidden: false,
  permissions: [],
  usage: "adjourned",
  description: "Adjourns court",
  category: "Mod Commands",

  slash: new SlashCommandBuilder()
    .setName("adjourned")
    .setDescription("Cleans up court")
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  /**
   * @param {Bot} bot
   * @param {ChatInputCommandInteraction} interaction
   */
  run: async (bot, interaction) => {
    // Give user jailed role
    // jail 812742522194493440
    // on trial 813938638709719050

    interaction.guild.channels.fetch("813402218811490374").then((channel) => {
      channel.messages
        .fetch()
        .then((messages) => {
          interaction.reply({
            content: "Deleting Messages <a:thumbs_up:875343102590738455>",
            ephemeral: true,
          });
          let promises = messages.map((message) => message.delete());
          Promise.all(promises)
            .then(() => {
              const embed = utils
                .getDefaultMessageEmbed(bot, {
                  title: "Court is in Session",
                  description:
                    "This channel operates on *Slow Mode*. You may only speak every **1 minute**, so make your words count.",
                })
                .setAuthor({ name: "Judge CryoBot" })
                .setImage((url = "https://i.imgur.com/ave0Q8e.png"));
              channel.send({ embeds: [embed] });
            })
            .catch(console.error);
        })
        .catch(console.error);
    });
  },
};
