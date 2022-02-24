const { Message, MessageEmbed } = require('discord.js');
const Bot = require('../../../Bot');
const { Random } = require("random-js");
const utils = require('../../utils/discordUtils.js')

mods = ['Nosp', 'Mitzy', 'Noah', 'Lens'];

module.exports = { 
    name: 'mod',
    aliases: ['BestMod', 'bestMod', 'bestmod', 'mods'],
    usage: 'mod',
    description: 'Displays who is the best moderator',
    
    /** 
     * @param {Bot} bot 
     * @param {Message} message 
     */
    run: async (bot, message) => {
        const embed = utils.getDefaultMessageEmbed(bot, {title:'Best Mod'}).setDescription(`🙌 ${new Random().pick(mods)} is best mod 🙌`)
        return message.channel.send({embeds:[embed]});
    }
};