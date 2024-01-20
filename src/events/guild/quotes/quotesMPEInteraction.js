const { Interaction, ActionRowBuilder, ButtonBuilder, ButtonStyle, bold, parseEmoji, formatEmoji, hyperlink } = require('discord.js');
const Bot = require('../../../../Bot');
const colors = require('../../../utils/colors.js');
const utils = require('../../../utils/discordUtils.js');

module.exports = {
    eventName: 'interactionCreate',
    /**
     * 
     * @param {Bot} bot 
     * @param {Interaction} interaction 
     */
    callback: async (bot, interaction) => {
        if (!interaction.customId) return;
        if (!interaction.customId.startsWith('quote')) return;
        
        if (interaction.isButton()) {
            switch (interaction.customId) {
                case 'quotePrevPage':
                    {
                        bot.database.query(`SELECT mpe FROM quoteMPEs WHERE serverId=${interaction.guildId}`, async function (err, results) {
                            if (err) return console.log(err.stack);

                            mpe = JSON.parse(results[0]['mpe']);

                            const title = interaction.message.embeds[0].title;
                            const currPage = title.split('[')[1].split('/')[0];
    
                            let targetPage = parseInt(currPage) - 1;
                            if (targetPage < 1) {
                                targetPage += mpe['num_pages'];
                            }

                            const embed = utils.getDefaultMessageEmbed(bot, { title:`Quotes Page [${targetPage}/${mpe['num_pages']}]` });
                            mpe[`page_${targetPage}`].forEach(x => {
                                embed.addFields({name: `#${x['quoteId']}`, value: `${x['quote']}` });
                            });

                            interaction.update({ embeds: [ embed ]});
                        });

                    }
                    break;
                case 'quoteNextPage':
                    {
                        bot.database.query(`SELECT mpe FROM quoteMPEs WHERE serverId=${interaction.guildId}`, async function (err, results) {
                            if (err) return console.log(err.stack);

                            mpe = JSON.parse(results[0]['mpe']);

                            const title = interaction.message.embeds[0].title;
                            const currPage = title.split('[')[1].split('/')[0];
    
                            let targetPage = parseInt(currPage) + 1;

                            if (targetPage > mpe['num_pages']) {
                                targetPage -= mpe['num_pages'];
                            }

                            const embed = utils.getDefaultMessageEmbed(bot, { title:`Quotes Page [${targetPage}/${mpe['num_pages']}]` });
                            mpe[`page_${targetPage}`].forEach(x => {
                                embed.addFields({name: `#${x['quoteId']}`, value: `${x['quote']}` });
                            });

                            interaction.update({ embeds: [ embed ]});
                        });
                    }
                    break;
                case 'quoteDeleteEmbed':
                    interaction.message.delete();
                    break;
                }
        }
    }
}