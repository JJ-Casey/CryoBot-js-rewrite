const { ActivityType, Events } = require("discord.js");
const Bot = require("../../../Bot");
const { prefix } = require("../../../config.json");
const dayjs = require("dayjs");
const utils = require("../../utils/discordUtils.js");

module.exports = {
  eventName: Events.GuildCreate,
  callback: async (bot, guild) => {
    console.log("Found a new guild!", JSON.stringify(guild));
    const commands = [];

    // Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
    for (const slashCommand of bot.slashCommands.values()) {
      // Don't add dev commands
      if (slashCommand.hidden) {
        continue;
      }
      commands.push(slashCommand.slash.toJSON());
    }
    // Construct and prepare an instance of the REST module
    const rest = new REST({ version: "10" }).setToken(
      process.env.DISCORD_TOKEN
    );

    // and deploy your commands!
    (async () => {
      try {
        rest.put(
          Routes.applicationGuildCommands(
            process.env.DISCORD_APPLICATION_ID,
            guild.id
          ),
          { body: commands }
        );
      } catch (error) {
        console.error(error);
      }
    })();
  },
};
