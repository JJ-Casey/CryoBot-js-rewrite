const { ChatInputCommandInteraction, ActivityType, SlashCommandBuilder } = require('discord.js');
const Bot = require('../../../Bot');
const colors = require('../../utils/colors.js');
const utils = require('../../utils/discordUtils.js');
const perms = require('../../utils/perms');

choices = ['🙌 JJ is best admin 🙌', '🙌 Cat is best admin 🙌']
module.exports = { 
    name: 'set-presence',
    hidden: true,
    permissions: [ perms.checkIsAdministrator() ],
    usage: 'setPresence [presence text]',
    description: 'Set the presence of the bot.',
    category: 'Configuration & Management',

    slash: new SlashCommandBuilder()
        .setName('set-presence')
        .setDescription('Sets the presence of CryoBot')
        .addStringOption(option =>
            option.setName('type')
                .setDescription('The type of Activity')
                .setRequired(true)
                .addChoices(
                    { name: 'Playing', value: '0' },
                    { name: 'Streaming', value: '1' },
                    { name: 'Listening', value: '2' },
                    { name: 'Watching', value: '3' },
                    { name: 'Custom', value: '4' },
                    { name: 'Competing', value: '5' },
                ))
        .addStringOption(option =>
            option.setName('name')
                .setDescription('The name/description of the Activity')
                .setRequired(true)),
    
    /** 
     * @param {Bot} bot 
     * @param {ChatInputCommandInteraction} interaction 
     */
    run: async (bot, interaction) => {
        interaction.reply({ embeds: [ utils.getDefaultMessageEmbed(bot).setTitle('Set Presence').setDescription('Presence has been updated') ] });
        bot.user.setActivity(interaction.options.getString('name'), { type: parseInt(interaction.options.getString('type')) });
    }
};