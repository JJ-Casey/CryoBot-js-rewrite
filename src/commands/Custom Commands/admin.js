const { Message, MessageEmbed } = require('discord.js');
const Bot = require('../../../Bot');
const colors = require('../../../colors.json');

choices = ['🙌 JJ is best admin 🙌', '🙌 Cat is best admin 🙌']
module.exports = { 
    name: 'admin',
    aliases: ['BestAdmin', 'bestAdmin', 'admins', 'bestadmin'],
    usage: 'admin',
    description: 'Displays who is the best admin',
    
    /** 
     * @param {Bot} bot 
     * @param {Message} message 
     */
    run: async (bot, message) => {
        const embed = new MessageEmbed({title:'Best Admin'}).setColor(colors.DefaultEmbed);
        embed.setDescription(`${choices[Math.floor(Math.random() * choices.length)]}`)
        return message.channel.send({embeds:[embed]});
    }
};