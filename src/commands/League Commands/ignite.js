const { Message, MessageEmbed, GuildMember } = require('discord.js');
const Bot = require('../../../Bot');
const colors = require('../../../colors.json');
const utils = require('../../utils/discordUtils.js')

module.exports = {  
    name: 'ignite',
    usage: 'ignite [member]',
    description: 'Displays when a member joined',
    
    /** 
     * @param {Bot} bot 
     * @param {Message} message 
     * @param {GuildMember} target
     */
    run: async (bot, message, args) => {
        target = utils.resolveMember(message.guild, args[0]);
        if (target == null) {
            return message.channel.send(`${message.member.displayName} ignites themself in confusion!`);
        }

        return message.channel.send(`${message.member.displayName} ignites ${target.displayName}`);
    }
};