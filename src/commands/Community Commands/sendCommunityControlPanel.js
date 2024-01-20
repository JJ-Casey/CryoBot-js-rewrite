const { Message, MessageEmbed, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const Bot = require('../../../Bot');
const colors = require('../../utils/colors.js');
const perms = require('../../utils/perms.js');
const utils = require('../../utils/discordUtils.js')

community_cp_channel_id = '733676206943371297';

module.exports = { 
    name: 'sendCommunityControlPanel',
    usage: 'sendCommunityControlPanel',
    permissions : [ perms.checkIsOwner() ],
    hidden: true,
    description: 'Sends the control panel for the Community Games',
    category: 'Personal Commands',
    
    /** 
     * @param {Bot} bot 
     * @param {Message} message 
     */
    run: async (bot, message, args) => {
        const embed = new MessageEmbed({ title: 'Community Games Control Panel', description: 'Control Panel for the <@&847790366426005554> users'})
            .setColor(colors.Red)
            .addField('Status', 'Offline');
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('cpOpen')
                    .setLabel('Open')
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setCustomId('cpClose')
                    .setLabel('Close')
                    .setStyle(ButtonStyle.Danger),
            );
        bot.channels.cache.get(community_cp_channel_id).send({ embeds:[embed], components: [row] });
    }
};