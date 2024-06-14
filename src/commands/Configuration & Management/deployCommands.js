const {
  REST,
  Routes,
  ChatInputCommandInteraction,
  SlashCommandBuilder,
} = require("discord.js");
const colors = require("../../utils/colors.js");
const utils = require("../../utils/discordUtils.js");
const perms = require("../../utils/perms.js");

module.exports = {
  name: "deployCommands",
  usage: "deployCommands",
  hidden: true,
  permissions: [perms.checkIsOwner()],
  description: "Deploy the slash commands to the server",
  category: "Configuration & Management",

  slash: new SlashCommandBuilder()
    .setName("deploy-commands")
    .setDescription("Deploy slash commands to the server")
    .addStringOption((option) =>
      option
        .setName("server-id")
        .setDescription("The server ID to deploy the commands to")
        .setRequired(false)
    ),

  /**
   * @param {Bot} bot
   * @param {ChatInputCommandInteraction} interaction
   */
  run: async (bot, interaction) => {
    const commands = [];

    const serverId =
      interaction.options.getString("server-id") ?? "733676009374744707";

    // Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
    if (serverId == "733676009374744707") {
      for (const slashCommand of bot.slashCommands.values()) {
        commands.push(slashCommand.slash.toJSON());
      }
    } else {
      for (const slashCommand of bot.slashCommands.values()) {
        // Don't add dev commands
        if (slashCommand.hidden) {
          continue;
        }
        commands.push(slashCommand.slash.toJSON());
      }
    }
    // Construct and prepare an instance of the REST module
    const rest = new REST({ version: "10" }).setToken(
      process.env.DISCORD_TOKEN
    );

    // and deploy your commands!
    (async () => {
      try {
        const embed = utils
          .getDefaultMessageEmbed(bot, { color: colors.Orange })
          .setTitle("Refreshing application commands")
          .addFields({
            name: "Refreshing",
            value: `Started refreshing ${commands.length} application (/) commands.`,
          });
        interaction.reply({ embeds: [embed] }).then(() => {
          // The put method is used to fully refresh all commands in the guild with the current set
          rest
            .put(
              Routes.applicationGuildCommands(
                process.env.DISCORD_APPLICATION_ID,
                serverId
                // process.env.DISCORD_DEV_SERVER_ID
              ),
              { body: commands }
            )
            .then((data) => {
              embed
                .setFields({
                  name: "Refreshed",
                  value: `Successfully reloaded ${data.length} application (/) commands.`,
                })
                .setColor(colors.Green);

              interaction.editReply({ embeds: [embed] });
            });
        });
      } catch (error) {
        console.error(error);
      }
    })();
  },
};
