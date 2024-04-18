const { ChatInputCommandInteraction, SlashCommandBuilder } = require('discord.js');
const Bot = require('../../../Bot');
const { ownerID } = require('../../../config.json');
const colors = require('../../utils/colors.js');
const perms = require('../../utils/perms.js');
const utils = require('../../utils/discordUtils.js')
const API = require('../../utils/pebbleAPI.js')

module.exports = {
    name: 'restart',
    hidden: true,
    permissions: [ perms.checkIsOwner() ],
    usage: 'restart',
    description: 'Restarts the bot',
    category: 'Configuration & Management',

    slash: new SlashCommandBuilder()
        .setName('restart')
        .setDescription('Restart CryoBot'),

    /** 
     * @param {Bot} bot 
     * @param {ChatInputCommandInteraction} interaction 
     */
    run: async (bot, interaction) => {
        if (interaction.member.id !== ownerID) {
            return;
        }
        interaction.reply({ embeds: [utils.getDefaultMessageEmbed(bot, { title: 'Restarting', color: colors.Orange, description: `Restarting ${bot.user.username}` })] })
            .then(msg => {
                process.exit();
                // API.makeRequest('restartServer', content = {id: process.env.PEBBLE_SERVER_ID}, process.env.PEBBLE_API_USER, process.env.PEBBLE_API_KEY);
            })
            .catch((e) => { console.error(`Error! ${e}`) });
    }
};