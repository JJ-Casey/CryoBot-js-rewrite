const { GuildMember, Message, MessageAttachment, MessageEmbed } = require('discord.js');
const Bot = require('../../../Bot');
const colors = require('../../../colors.json');

const nami_id = "270944077820854273"

module.exports = { 
    name: 'poke',
    usage: 'poke [user]',
    description: 'Pokes someone',
    
    /** 
     * @param {Bot} bot 
     * @param {Message} message 
     * @param {GuildMember} target 
     */
    run: async (bot, message, target) => {
        message.channel.sendTyping()
        const embed = new MessageEmbed().setColor(colors.DefaultEmbed);

        target = target[0]
        desc =''
        if (message.author.id == nami_id){
            if (target != null){
                if (memb.id == 270944077820854273){
                    desc = `${message.author} hurt themselves in confusion!`;
                }else{
                    desc = `${message.author} climbs out of their pond to poke {memb.mention}`;
                }
            }else{
                desc = `${message.author} climbs out of their pond to assert dominance`;
            }
        }else{
            if (target != null){
                desc = `${message.author} steals Nami\'s staff to poke ${target}`;
            }else{
                desc = `${message.author} steals Nami\'s staff. Give it back <:pepeHmmm:768807772548497420>`;
            }
        }
        
        const file = new MessageAttachment('./assets/images/nami_spam_gif.gif', 'namispam.gif');
        embed.setImage('attachment://namispam.gif');

        embed.setDescription(desc);

        message.channel.send({embeds:[embed], files:[file]});
    }
};