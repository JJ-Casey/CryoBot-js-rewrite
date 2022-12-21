const { REST, Routes, ChatInputCommandInteraction, SlashCommandBuilder } = require('discord.js');
const colors = require('../../utils/colors.js');
const utils = require('../../utils/discordUtils.js');

module.exports = { 
    name: 'deploy-commands',
    usage: 'deployCommands',
    hidden: true,
    permissions: [],
    description: 'Deploy the slash commands to the server',
    category: 'Configuration & Management',

    slash: new SlashCommandBuilder()
        .setName('deploy-commands')
        .setDescription('Deploy slash commands to the server'),

    /** 
     * @param {Bot} bot 
     * @param {ChatInputCommandInteraction} interaction 
     */
    run: async (bot, interaction) => {
        const commands = [];
        
        // Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
        for (const slashCommand of bot.slashCommands.values()) {
            commands.push(slashCommand.slash.toJSON());
        }
        // Construct and prepare an instance of the REST module
        const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
        
        // and deploy your commands!
        (async () => {
            try {
                const embed = utils.getDefaultMessageEmbed(bot, {color: colors.Orange})
                    .setTitle('Refreshing application commands')
                    .addFields({ name:'Refreshing', value: `Started refreshing ${commands.length} application (/) commands.` })
                interaction.reply({ embeds: [embed] }).then(() => {
                    // The put method is used to fully refresh all commands in the guild with the current set
                    rest.put(
                        Routes.applicationGuildCommands(process.env.DISCORD_APPLICATION_ID, process.env.DISCORD_DEV_SERVER_ID),
                        { body: commands },
                    ).then(data =>{
                        embed.setFields({ name:'Refreshed', value: `Successfully reloaded ${data.length} application (/) commands.` })
                            .setColor(colors.Green);
                
                        interaction.editReply({ embeds: [embed] });
                    });}
                );
            } catch (error) {
                // And of course, make sure you catch and log any errors!
                console.error(error);
            }
        })();
    }
};