const { Message, MessageEmbed, GuildMember } = require('discord.js');
const Bot = require('../../../Bot');
const colors = require('../../../colors.json');
const utils = require('../../utils/discordUtils.js')

module.exports = { 
    name: 'joined',
    usage: 'joined (member)',
    description: 'Displays when a member joined',
    
    /** 
     * @param {Bot} bot 
     * @param {Message} message 
     */
    run: async (bot, message) => {
        target = message.mentions.members.first();
        if (target == null) {
            target = message.member;
        }

        joined = target.joinedAt;

        const embed = utils.getDefaultMessageEmbed(bot, {title:'Joined'})
                .setDescription(`${target} joined on ${joined}`)
                .setThumbnail(target.displayAvatarURL({ dynamic: true }));
        return message.channel.send({embeds:[embed]});
    }
};