const { ChatInputCommandInteraction, SlashCommandBuilder, AttachmentBuilder } = require('discord.js');
const Bot = require('../../../Bot');
const colors = require('../../utils/colors.js');
const utils = require('../../utils/discordUtils.js')

const nami_id = "270944077820854273"

module.exports = { 
    name: 'poke',
    usage: 'poke (user)',
    hidden: true,
    permissions: [],
    description: 'Pokes someone',
    category: 'Personal Commands',

    slash: new SlashCommandBuilder()
        .setName('poke')
        .setDescription('Pokes someone')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('The member that you want to poke')
        ),
    
    /** 
     * @param {Bot} bot 
     * @param {ChatInputCommandInteraction} interaction 
     */
    run: async (bot, interaction) => {
        interaction.channel.sendTyping();
        const embed = utils.getDefaultMessageEmbed(bot);

        let author = interaction.member;
        let target = interaction.options.getMember('target');

        let desc ='';
        if (interaction.member.id == nami_id) {
            if (target != null) {
                if (memb.id == nami_id) {
                    desc = `${message.author} hurt themselves in confusion!`;
                } else {
                    desc = `${message.author} climbs out of their pond to poke {memb.mention}`;
                }
            } else {
                desc = `${message.author} climbs out of their pond to assert dominance`;
            }
        } else 
        {
            if (target != null) {
                desc = `${author} steals Nami\'s staff to poke ${target}`;
            }else{
                desc = `${author} steals Nami\'s staff. Give it back <:pepeHmmm:768807772548497420>`;
            }
        }
        
        embed.setImage('https://i.imgur.com/Q9V1ED5.gif');
        embed.setDescription(desc);

        interaction.reply({embeds:[embed]});
    }
};