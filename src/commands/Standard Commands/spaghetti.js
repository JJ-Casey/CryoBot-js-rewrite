const { ChatInputCommandInteraction, SlashCommandBuilder } = require('discord.js');
const Bot = require('../../../Bot');
const utils = require('../../utils/discordUtils.js')

module.exports = { 
    name: 'spaghetti',
    usage: 'spaghetti',
    hidden: false,
    permissions: [],
    description: 'Shame JJ for CryoBot having Spaghetti code',
    category: 'Standard Commands',

    slash: new SlashCommandBuilder()
        .setName('spaghetti')
        .setDescription('Shame JJ for CryoBot having Spaghetti code'),

    /** 
     * @param {Bot} bot 
     * @param {ChatInputCommandInteraction} interaction 
     */
    run: async (bot, interaction) => {
        bot.database.query(`SELECT count FROM counters WHERE name=\'spaghetti\' and serverId=${interaction.guildId}`, function (err, result, fields) {
            if (err) { return interaction.reply({embeds : [ utils.getDefaultMessageEmbed(bot, {title:'Error', description: `Message: ${err}`})]});}
            if (!result[0]) {
                bot.database.query(`INSERT INTO counters VALUES (${interaction.guildId},\'spaghetti\',1)`);
                return interaction.reply(`${bot.user.username} has had 1 instances of spaghetti code!`);
            }
            curr_val = parseInt(result[0].count) + 1
            interaction.reply(`${bot.user.username} has had ${curr_val} instances of spaghetti code!`);
            bot.database.query(`UPDATE counters SET count=${curr_val} WHERE name=\'spaghetti\' AND serverId=${interaction.guildId}`);
        });
    }
};