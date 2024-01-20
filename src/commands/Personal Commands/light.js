const { ChatInputCommandInteraction, SlashCommandBuilder, AttachmentBuilder } = require('discord.js');
const Bot = require('../../../Bot');
const colors = require('../../utils/colors.js');
const utils = require('../../utils/discordUtils.js')

module.exports = { 
    name: 'light',
    usage: 'light',
    hidden: true,
    permissions: [],
    description: 'Light :)',
    category: 'Personal Commands',

    slash: new SlashCommandBuilder()
        .setName('light')
        .setDescription('it\'s morbin\' time'),
    
    /** 
     * @param {Bot} bot 
     * @param {ChatInputCommandInteraction} interaction 
     */
    run: async (bot, interaction) => {
        interaction.channel.sendTyping();
        const embed = utils.getDefaultMessageEmbed(bot);

        // if (interaction.member.id == nami_id) {
        //     if (target != null) {
        //         if (memb.id == nami_id) {
        //             desc = `${message.author} hurt themselves in confusion!`;
        //         } else {
        //             desc = `${message.author} climbs out of their pond to poke {memb.mention}`;
        //         }
        //     } else {
        //         desc = `${message.author} climbs out of their pond to assert dominance`;
        //     }
        // } else 
        embed.setImage('https://i.imgur.com/gqQE6Sp.png');

        interaction.reply({ embeds: [embed] });
    }
};