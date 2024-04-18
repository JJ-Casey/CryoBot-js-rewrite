const { Message, } = require('discord.js');
const Bot = require('../../../Bot');
const { Random } = require("random-js");
const colors = require('../../utils/colors.js');
const utils = require('../../utils/discordUtils.js')

module.exports = {
    name: 'choose',
    aliases: ['pick'],
    usage: 'choose [choices]',
    hidden: false,
    permissions: [],
    description: 'Choose between space-separated options, grouped by quotation marks',
    category: 'Standard Commands',

    /** 
     * @param {Bot} bot 
     * @param {Message} message 
     * @param {string[]} choices
     */
    run: async (bot, message, args) => {
        fullInput = args.join(' ');
        if (fullInput.includes('"')) {
            quotedChoices = [...fullInput.match(/\"([^"]+)\"/g)];
            quotedChoices.forEach(choice => fullInput = fullInput.replace(choice, ''));
            quotedChoices = quotedChoices.map(choice => choice.replaceAll('"', ''));
            choices = quotedChoices.concat(fullInput.split(' ').filter(choice => choice.length > 0));
        } else {
            choices = fullInput.split(' ').filter(choice => choice.length > 0);
        }

        const embed = utils.getDefaultMessageEmbed(bot, { title: 'Choose' });

        if (choices.length == 0) {
            embed.setColor(colors.Orange);
            embed.setDescription(`${this.description}\n**Usage:** ${usage}`);
            return message.reply({ embeds: [embed] })
        }
        if (choices.length == 1) {
            choices = choices[0].split(' ');
        }
        if (choices.length <= 1) {
            embed.setColor(colors.FireBrick);
            embed.addFields({ name: 'Error', value: 'Please add more choices to choose from!' });
            embed.addFields({ name: 'Choices parsed', value: `${choices.join(", ")}` })
            return message.reply({ embeds: [embed] })
        }

        embed.setDescription(`**Result:** ${new Random().pick(choices)}`);
        return message.reply({ embeds: [embed] })
    }
};