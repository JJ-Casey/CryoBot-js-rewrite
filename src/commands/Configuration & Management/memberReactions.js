const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  parseEmoji,
  formatEmoji,
} = require("discord.js");
const Bot = require("../../../Bot.js");
const { ownerID } = require("../../../config.json");
const utils = require("../../utils/discordUtils.js");
const perms = require("../../utils/perms.js");

module.exports = {
  name: "memberReactions",
  hidden: false,
  permissions: [perms.checkIsOwner()],
  usage: "memberReactions [sub command]",
  description: "Manage and view member reactions",
  category: "Configuration & Management",

  slash: new SlashCommandBuilder()
    .setName("member-reactions")
    .setDescription("Manage and view member reactions")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("add")
        .setDescription("Add a reaction to a member")
        .addUserOption((option) =>
          option
            .setName("target")
            .setDescription("The member to add the reaction to")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("emote")
            .setDescription("The emote to add to the reaction list")
            .setRequired(true)
        )
        .addNumberOption((option) =>
          option
            .setName("probability")
            .setDescription("The probability that the emote is added")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("remove")
        .setDescription("Remove a reaction from a member")
        .addUserOption((option) =>
          option
            .setName("target")
            .setDescription("The member to remove the reaction from")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("emote")
            .setDescription("The emote to add remove from the reaction list")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("edit-emote")
        .setDescription("Replace a reaction for a member")
        .addUserOption((option) =>
          option
            .setName("target")
            .setDescription("The member to change the reaction of")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("old-emote")
            .setDescription("The emote to be replaced")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("new-emote")
            .setDescription("The emote to replace with")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("edit-probability")
        .setDescription("Edit the probability of a reaction for a member")
        .addUserOption((option) =>
          option
            .setName("target")
            .setDescription("The member to change the reaction of")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("emote")
            .setDescription("The emote to change the probability for")
            .setRequired(true)
        )
        .addNumberOption((option) =>
          option
            .setName("new-probability")
            .setDescription("The new probability that the emote is added")
            .setRequired(true)
        )
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  /**
   * @param {Bot} bot
   * @param {Message} message
   */
  run: async (bot, interaction) => {
    switch (interaction.options.getSubcommand()) {
      case "add":
        {
          const target = interaction.options.getUser("target");
          const emote = interaction.options.getString("emote");
          const prob = interaction.options.getNumber("probability");

          const query =
            "SELECT memberKEY FROM members WHERE serverId=? AND memberId=?";
          bot.database.query(
            query,
            [interaction.guild.id, target.id],
            function (err, results) {
              if (err) {
                return utils.raiseError(bot, err);
              }
              const memberKEY = results[0]["memberKEY"];

              // Check if there is already this reaction for this person
              const query2 =
                "SELECT * FROM memberreactions WHERE memberKEY=? AND reaction=?";
              bot.database.query(
                query2,
                [memberKEY, emote],
                function (err2, results2) {
                  if (err2) {
                    return utils.raiseError(bot, err2);
                  }

                  // if reaction exists, don't add it again
                  if (results2.length > 0) {
                    const alreadyExistsEmbed = utils.getDefaultMessageEmbed(
                      bot,
                      {
                        title: "Reaction already exists",
                      }
                    );
                    alreadyExistsEmbed.addFields({
                      name: utils.emptyEmbed,
                      value: `The reaction ${emote} already exists for ${target}`,
                    });
                    return interaction.reply({ embeds: [alreadyExistsEmbed] });
                  }

                  // if reaction doesn't exist, add it
                  const query3 =
                    "INSERT INTO memberreactions (memberKEY, reaction, probability) VALUES (?, ?, ?) ";
                  bot.database.query(
                    query3,
                    [memberKEY, emote, prob],
                    function (err3, results3) {
                      if (err3) {
                        return utils.raiseError(bot, err3);
                      }

                      const embed = utils.getDefaultMessageEmbed(bot, {
                        title: "Member Message Reaction Added",
                      });
                      embed.addFields({
                        name: "Success",
                        value: `${target} will now be reacted to with ${emote} with a ${
                          100 * prob
                        }% chance`,
                        inline: true,
                      });
                      interaction.reply({ embeds: [embed] });
                    }
                  );
                }
              );
            }
          );
        }
        break;
      case "remove":
        {
          const target = interaction.options.getUser("target");
          const emote = interaction.options.getString("emote");

          const query1 =
            "SELECT memberKEY FROM members WHERE serverId=? AND memberId=?";
          bot.database.query(
            query1,
            [interaction.guild.id, target.id],
            function (err, results) {
              if (err) {
                return utils.raiseError(bot, err);
              }
              const memberKEY = results[0]["memberKEY"];

              const query =
                "DELETE FROM memberreactions WHERE memberKEY=? AND reaction=?";
              bot.database.query(
                query,
                [memberKEY, emote],
                function (err, results) {
                  if (err) {
                    return utils.raiseError(bot, err);
                  }

                  if (results["affectedRows"] == 0) {
                    return interaction.reply({
                      content: "That emote didn't exist - nothing has changed!",
                      ephemeral: true,
                    });
                  }

                  const embed = utils.getDefaultMessageEmbed(bot, {
                    title: "Member Message Reaction Removed",
                  });
                  embed.addFields({
                    name: "Success",
                    value: `${target} will no longer be reacted to with ${emote}`,
                    inline: true,
                  });
                  interaction.reply({ embeds: [embed] });
                }
              );
            }
          );
        }
        break;
      case "edit-emote":
        {
          const target = interaction.options.getUser("target");
          const oldemote = interaction.options.getString("old-emote");
          const newemote = interaction.options.getString("new-emote");

          const query1 =
            "SELECT memberKEY FROM members WHERE serverId=? AND memberId=?";
          bot.database.query(
            query1,
            [interaction.guild.id, target.id],
            function (err, results) {
              if (err) {
                return utils.raiseError(bot, err);
              }
              const memberKEY = results[0]["memberKEY"];

              const query =
                "UPDATE memberreactions SET reaction=? WHERE memberKEY=? AND reaction=?";
              bot.database.query(
                query,
                [newemote, memberKEY, oldemote],
                function (err, results) {
                  if (err) {
                    return utils.raiseError(bot, err);
                  }

                  if (results["affectedRows"] == 0) {
                    return interaction.reply({
                      content:
                        "That emote, or user, didn't exist - nothing has changed!",
                      ephemeral: true,
                    });
                  }

                  const embed = utils.getDefaultMessageEmbed(bot, {
                    title: "Member Message Reaction Updated",
                  });
                  embed.addFields({
                    name: "Success",
                    value: `${target} will no longer be reacted to with ${oldemote} and will now be reacted to with ${newemote}`,
                    inline: true,
                  });
                  interaction.reply({ embeds: [embed] });
                }
              );
            }
          );
        }
        break;
      case "edit-probability":
        {
          const target = interaction.options.getUser("target");
          const emote = interaction.options.getString("emote");
          const newprob = interaction.options.getNumber("new-probability");

          const query1 =
            "SELECT memberKEY FROM members WHERE serverId=? AND memberId=?";
          bot.database.query(
            query1,
            [interaction.guild.id, target.id],
            function (err, results) {
              if (err) {
                return utils.raiseError(bot, err);
              }
              const memberKEY = results[0]["memberKEY"];

              const query =
                "UPDATE memberreactions SET probability=? WHERE memberKEY=? AND reaction=?";
              bot.database.query(
                query,
                [newprob, memberKEY, emote],
                function (err, results) {
                  if (err) {
                    return utils.raiseError(bot, err);
                  }

                  if (results["affectedRows"] == 0) {
                    return interaction.reply({
                      content:
                        "That emote, or user, didn't exist - nothing has changed!",
                      ephemeral: true,
                    });
                  }

                  const embed = utils.getDefaultMessageEmbed(bot, {
                    title: "Member Message Reaction Updated",
                  });
                  embed.addFields({
                    name: "Success",
                    value: `${target} now be reacted to with ${emote} with a probability of ${
                      100 * newprob
                    }%`,
                    inline: true,
                  });
                  interaction.reply({ embeds: [embed] });
                }
              );
            }
          );
        }
        break;
    }
  },
};
