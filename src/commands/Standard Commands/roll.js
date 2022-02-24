const { Message, MessageEmbed } = require('discord.js');
const Bot = require('../../../Bot');
const colors = require('../../../colors.json');
const { Random } = require("random-js");

module.exports = { 
    name: 'roll',
    usage: 'roll [NdM]',
    description: 'Roll an M-sided die N times',
    
    /** 
     * @param {Bot} bot 
     * @param {Message} message 
     * @param {string[]} args
     */
    run: async (bot, message, args) => {
        const embed = new MessageEmbed({title:'Roll Dice'}).setColor(colors.DefaultEmbed);
        [rolls, side_count] = args[0].split('d')

        if (isNaN(parseInt(rolls)) || isNaN(parseInt(side_count))) {
            embed.setColor(colors.FireBrick);
            embed.addField('Error!', 'Must be in NdM format');
            embed.addField('Example', '!roll 2d4');
            return message.channel.send({embeds:[embed]})
        }

        embed.addField('Result', new Random().dice(side_count, rolls).join(', '));

        message.channel.send({embeds:[embed]})
    }
};