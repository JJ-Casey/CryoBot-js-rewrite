const { Message, MessageEmbed } = require('discord.js');
const Bot = require('../../../Bot');
const colors = require('../../../colors.json');

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
        try {   
            [rolls, limit] = args[0].split('d').map(parseInt);
        } catch (e) {
            embed.setColor(colors.FireBrick)
            embed.addField('Error', 'Format has to be `NdN`!')
            embed.addField('Example', `!roll 2d4`)
            message.channel.send({embeds=[embed]})
        }
        
        // result = ', '.join(str(random.randint(1, limit)) for r in range(rolls))
        // embed.description = f'**Result:** {result}'

        message.channel.send({embeds=[embed]})
    }
};