const { ChatInputCommandInteraction, SlashCommandBuilder } = require('discord.js');
const Bot = require('../../../Bot');
const utils = require('../../utils/discordUtils.js');

module.exports = { 
    name: 'quotes',
    aliases: [],
    hidden: false,
    permissions: [],
    usage: 'quotes (subcommands) (args)',
    description: 'Display quotes from the server and stream',
    category: 'Standard Commands',
    
    slash: new SlashCommandBuilder()
        .setName('quotes')
        .setDescription('Display quotes from the server and stream'),
    
    /** 
     * @param {Bot} bot 
     * @param {ChatInputCommandInteraction} interaction 
     */
    run: async (bot, interaction) => {
        bot.database.query(`SELECT quoteId, quote FROM quotes WHERE serverId=${interaction.guild.id}`, function (err, results) {
            if (err) return console.error(err.stack);

            const embed = utils.getDefaultMessageEmbed(bot, { title:"Quotes" });
            for (var i = 0; i < 4; i++) {
                embed.addFields({name: `Quote #${results[i].quoteId}`, value: `Quote: ${results[i].quote}` });
            }
            interaction.reply({embeds:[embed]});
        });
    }
};