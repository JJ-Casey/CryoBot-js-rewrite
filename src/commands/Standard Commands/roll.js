const { ChatInputCommandInteraction, SlashCommandBuilder } = require('discord.js');
const Bot = require('../../../Bot');
const colors = require('../../utils/colors.js');
const { Random, string } = require("random-js");
const utils = require('../../utils/discordUtils.js')

module.exports = { 
    name: 'roll',
    usage: 'roll [NdM]',
    hidden: false,
    permissions: [],
    description: 'Roll an M-sided die N times',
    category: 'Standard Commands',

    slash: new SlashCommandBuilder()
        .setName('roll')
        .setDescription('Roll an M-sided die N times')
        .addIntegerOption(option =>
            option.setName('number')
                .setDescription('The number of dice to roll')
                .setMinValue(1)
                .setMaxValue(100)
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('sides')
                .setDescription('The number of sides the dice have')
                .setMinValue(4)
                .setMaxValue(100)
                .setRequired(true)),
    
    /** 
     * @param {Bot} bot 
     * @param {ChatInputCommandInteraction} interaction 
     */
    run: async (bot, interaction) => {
        const embed = utils.getDefaultMessageEmbed(bot, {title:'Roll Dice'});

        let rolls = new Random().dice(interaction.options.getInteger('sides'), interaction.options.getInteger('number'))
        const sum = rolls.reduce((a,b) => { return a+b; });
        const max = Math.max(...rolls);
        const min = Math.min(...rolls);

        embed.addFields(
            { name: 'Result', value: rolls.join(', ') },
            { name: 'Sum', value: `${sum}` },
            { name: 'Max', value: `${max}`, inline: true},
            { name: 'Min', value: `${min}`, inline: true}
        );

        interaction.reply({ embeds: [embed] });
    }
};