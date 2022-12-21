const { Message, ActionRowBuilder, ButtonBuilder, ButtonStyle} = require('discord.js');
const Bot = require('../../../Bot');
const perms = require('../../utils/perms.js');

module.exports = { 
    name: 'setDefaultPermissions',
    hidden: true,
    permissions : [ perms.checkIsOwner() ],
    usage: 'setDefaultPermissions [serverId]',
    description: 'Sets the permissions of all commands ',
    category: 'Super Secret Owner Commands',

    /** 
     * @param {Bot} bot 
     * @param {Message} message 
     * @param {string[]} args 
     */
    run: async (bot, message, args) => {
        const targetServerId = args[0];
        if (!targetServerId) {
            return;
        }
        const serverName = bot.guilds.cache.get(targetServerId).name;

        const filter = i => {
            return i.user.id === message.author.id;
        };

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('permConfirm')
                    .setLabel('Confirm')
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setCustomId('permCancel')
                    .setLabel('Cancel')
                    .setStyle(ButtonStyle.Danger),
            );

        message.reply({ content: `You are choosing to set default permissions for the server ${serverName}?`, components: [ row ] })
            .then((reply) => {
                message.channel.awaitMessageComponent({ filter, componentType: 'BUTTON', time: 60000})
                    .then(interaction => {
                        if (interaction.customId == 'permConfirm') {
                            reply.edit({ content: `Setting default permissions for the ${serverName}!`, components: [] });
                            // set perms
                        }
                        else {
                            reply.edit({ content: `No permissions have been changed for the ${serverName}.`, components: [] });
                        }
                        setTimeout(() => { reply.delete(); message.delete(); }, 10000);
                    });
            });
    }
};