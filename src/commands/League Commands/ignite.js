const { Message, GuildMember } = require('discord.js');
const Bot = require('../../../Bot');
const colors = require('../../utils/colors.js');
const utils = require('../../utils/discordUtils.js')

module.exports = { 
    name: 'ignite',
    usage: 'ignite [member]',
    hidden: false,
    permissions: [],
    description: 'Displays when a member joined',
    category: 'League Commands',
    
    /** 
     * @param {Bot} bot 
     * @param {Message} message 
     * @param {GuildMember} target
     */
    run: async (bot, message, args) => {
        user = message.mentions.users.first();

        user = user || args[0]

        if (user === undefined) { return message.channel.send(`${message.member.displayName} ignites themself in confusion!`); }

        message.guild.members.fetch(user)
            .then(memb => {
                if (memb === undefined) {
                    message.guild.members.fetch(args[0])
                        .then(memb => {
                            if (memb === undefined) {
                                return message.channel.send(`${message.member.displayName} ignites themself in confusion!`);
                            } else {
                                message.channel.send(`${message.member.displayName} ignites ${memb.displayName}`);
                            }
                        });
                } else {
                    message.channel.send(`${message.member.displayName} ignites ${memb.displayName}`);
                }}).catch(() => {

                    message.channel.send(`${message.member.displayName} ignites themself in confusion!`);
            });
    }
};