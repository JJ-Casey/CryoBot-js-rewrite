const { ChatInputCommandInteraction, SlashCommandBuilder } = require('discord.js');
const Bot = require('../../../Bot');
const { ownerID } = require('../../../config.json');
const colors = require('../../utils/colors.js');
const perms = require('../../utils/perms.js');
const utils = require('../../utils/discordUtils.js')

module.exports = {
    name: 'reload',
    hidden: true,
    permissions : [ perms.checkIsOwner() ],
    usage: 'reload [command name]',
    description: 'Reloads a command',
    category: 'Configuration & Management',

    slash: new SlashCommandBuilder()
        .setName('reload')
        .setDescription('Dynamically reload a command')
        .addStringOption(option =>
            option.setName('command')
                .setDescription('The command name to reload')
                .setRequired(true)),
    
    /** 
     * @param {Bot} bot 
     * @param {ChatInputCommandInteraction} interaction 
     */
    run: async(bot, interaction) => {
        if (interaction.member.id !== ownerID) {
            return;
        }

        const commandName = interaction.options.getString('command');
        let isSlash = false;

        if (!bot.commands.has(commandName)) {
            if (!bot.slashCommands.has(commandName)) {
                interaction.reply({ embeds : [ utils.getDefaultMessageEmbed(bot, { title: 'Error', color: colors.Red, description: `No such command called ${commandName}` })]})
                    .then(msg => setTimeout(() => msg.delete(), 5000));
                return;
            }
            isSlash = true;
        }
        interaction.reply({ embeds : [ utils.getDefaultMessageEmbed(bot, { title: 'Reloading', color: colors.Orange, description: `Reloading command: ${commandName}` })]})
            .then(() => {
                if (!isSlash) {
                    const command = bot.commands.get(commandName);
                    delete require.cache[require.resolve(`../${command.category}/${commandName}.js`)];
                    bot.commands.delete(commandName);
                    bot.commands.set(commandName, require(`../${command.category}/${commandName}.js`));
                } else {
                    const command = bot.slashCommands.get(commandName);
                    delete require.cache[require.resolve(`../${command.category}/${commandName}.js`)];
                    bot.slashCommands.delete(commandName);
                    bot.slashCommands.set(commandName, require(`../${command.category}/${commandName}.js`));
                }
                interaction.editReply({ embeds : [ utils.getDefaultMessageEmbed(bot, { title: 'Reloaded!', color: colors.Green, description: `Reloaded command: ${commandName}` })]})
            }
        );
    }
};