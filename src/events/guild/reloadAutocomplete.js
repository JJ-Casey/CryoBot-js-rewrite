const { Interaction } = require('discord.js');
const Bot = require('../../../Bot');
const colors = require('../../utils/colors.js');
const utils = require('../../utils/discordUtils.js');

module.exports = {
    eventName: 'interactionCreate',
    /**
     * 
     * @param {Bot} bot 
     * @param {Interaction} interaction 
     */
    callback: async (bot, interaction) => {
        if (!interaction.isAutocomplete()) return;

        if (!interaction.commandName.startsWith('reload')) return

        const focusedOption = interaction.options.getFocused(true);
        const focusedValue = focusedOption.value.toLowerCase();

        interaction.respond(
            bot.slashCommands.map(command => command.name)
                .filter(command => command.toLowerCase().startsWith(focusedValue))
                .map(choice => ({ name: choice, value: choice })));
    }
}