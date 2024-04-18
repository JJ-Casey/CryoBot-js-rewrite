const { Interaction, MessageEmbed } = require('discord.js');
const Bot = require('../../../Bot');
const colors = require('../../utils/colors.js');

module.exports = {
    eventName: 'interactionCreate',
    /**
     * 
     * @param {Bot} bot 
     * @param {Interaction} interaction 
     */
    callback: async(bot, interaction) => {
        if (interaction.isButton()) {
            switch (interaction.customId) {
                case 'cpOpen':
                    interaction.update({ embeds: [ new MessageEmbed({ title: 'Community Games Control Panel', description: 'Control Panel for the <@&847790366426005554> users'})
                    .setColor(colors.Green)
                    .addFields({name: 'Status', value:'Online'})] });
                    break;
                case 'cpClose':
                    interaction.update({ embeds: [ new MessageEmbed({ title: 'Community Games Control Panel', description: 'Control Panel for the <@&847790366426005554> users'})
                    .setColor(colors.Red)
                    .addFields({ name: 'Status', value : 'Offline'})] });
                    break;
            }
        }
    }
}