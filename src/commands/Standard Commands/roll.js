const { ChatInputCommandInteraction, SlashCommandBuilder } = require('discord.js');
const Bot = require('../../../Bot');
const colors = require('../../utils/colors.js');
const { Random } = require("random-js");
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
            option.setName('n')
                .setDescription('The number of dice to roll')
                .setMinValue(1)
                .setMaxValue(100)
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('m')
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

        embed.addFields({name: 'Result', value: new Random().dice(interaction.options.getInteger('m'), interaction.options.getInteger('n')).join(', ') });

        interaction.reply({embeds:[embed]});
    }
};