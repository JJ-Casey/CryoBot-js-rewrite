const {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  PermissionFlagsBits,
} = require("discord.js");
const Bot = require("../../../Bot.js");
const colors = require("../../utils/colors.js");
const utils = require("../../utils/discordUtils.js");
const { readdirSync } = require("fs");

module.exports = {
  name: "commands",
  usage: "commands (command)",
  hidden: false,
  permissions: [],
  description: "Shows list of commands",
  category: "Utilities",

  slash: new SlashCommandBuilder()
    .setName("commands")
    .setDescription("Shows list of commands")
    .addStringOption((option) =>
      option
        .setName("command")
        .setDescription("The command to get more information about")
    ),

  /**
   * @param {Bot} bot
   * @param {ChatInputCommandInteraction} interaction
   */
  run: async (bot, interaction) => {
    // return interaction.reply(
    //   "This command will show the list of commands and provide more information <:chadge:1070762061522538606>"
    // );
    const command = interaction.options.getString("command");
    if (command) {
      return getCmd(bot, interaction, command);
    } else {
      return getAll(bot, interaction);
    }
  },
};

function getAll(bot, interaction) {
  const embed = utils
    .getDefaultMessageEmbed(bot)
    .setColor(colors.Orange)
    .setFooter({
      text: "Syntax: () = optional, [] = required, {a, b} = choose between a or b",
      iconURL: bot.user.displayAvatarURL({ dynamic: true }),
    });

  bot.categories.forEach((category) => {
    const commands_in_category = bot.slashCommands
      .filter((command) => command.category == category)
      .filter((command) => !command.hidden)
      .map((command) => `\`${command.name}\``)
      .join(" ");
    if (commands_in_category == "") {
      return;
    }
    embed.addFields({
      name: category,
      value: commands_in_category,
    });
  });
  embed.addFields({
    name: utils.emptyEmbed,
    value: `To get help about a specific command, use \`/help [command name]\``,
  });

  return interaction.reply({ embeds: [embed] });
}

function getCmd(bot, interaction, command_name) {
  const embed = utils
    .getDefaultMessageEmbed(bot)
    .setColor(colors.SteelBlue)
    .setFooter({
      text: "Syntax: () = optional; [] = required; {a, b} = choose between a or b",
      iconURL: bot.user.displayAvatarURL({ dynamic: true }),
    });

  // Fetching the command data through bot.commands or bot.aliases
  const command = bot.slashCommands.get(command_name);

  let cmd;
  if (!command) {
    return interaction.reply(`**${command}** is not a command`);
  }

  embed.setDescription(`Command: **${command.name}**`);
  // The description
  embed.addFields({ name: "Description", value: `${command.description}` });
  embed.addFields({ name: "Usage", value: `\`/${command.usage}\`` });

  return interaction.reply({ embeds: [embed] });
}
