const { Message, MessageEmbed } = require('discord.js');
const Bot = require('../../../Bot');
const { Random } = require("random-js");
const colors = require('../../../colors.json');

module.exports = { 
    name: 'choose',
    aliases: ['pick'],
    usage: 'choose ',
    description: 'Choose between space-separated options, grouped by quotation marks',
    
    /** 
     * @param {Bot} bot 
     * @param {Message} message 
     * @param {string[]} choices
     */
    run: async (bot, message, choices) => {
        choices = choices.join(' ').split('"').filter(choice => choice.length > 0);

        if (choices.length == 1) {
            choices = choices[0].split(' ');
        }
        if (choices.length <= 1) {
            const embed = new MessageEmbed({title:'Choose'}).setColor(colors.FireBrick);
            embed.addField('Error', 'Please add more choices to choose from!');
            embed.addField('Choices parsed', `${choices.join(", ")}`)
            return message.channel.send({embeds:[embed]})
        }

        const embed = new MessageEmbed({title:'Choose'}).setColor(colors.DefaultEmbed);
        embed.setDescription(`**Result:** ${new Random().pick(choices)}`)
        return message.channel.send({embeds:[embed]})
    }
};