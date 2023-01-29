const { ChatInputCommandInteraction, SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, bold } = require('discord.js');
const Bot = require('../../../Bot');
const util = require('util')
const utils = require('../../utils/discordUtils.js');

const PAGE_SIZE = 10;

function createMPE(results) {
    const jsonMPE = {};
    jsonMPE['num_quotes'] = results.length;
    jsonMPE['largestPK'] = Math.max(...results.map(x=>x['quoteKEY']));
    jsonMPE['num_pages'] = Math.floor(results.length / PAGE_SIZE) + 1

    for (let pageNo = 1; pageNo <= jsonMPE['num_pages']; pageNo++) {
        const pageQuotes = results.filter((v,i) => ((pageNo - 1) * PAGE_SIZE <= i) & (i < pageNo * PAGE_SIZE));
        delete pageQuotes['quoteKEY'];
        const jsonString = JSON.stringify(pageQuotes);
        jsonMPE[`page_${pageNo}`] = JSON.parse(jsonString);
    }

    return jsonMPE;
}

async function buildMPE(bot, serverId) {
    return new Promise((resolve, reject) => {
        bot.database.query(`SELECT quoteKEY, quoteId, quote FROM quotes WHERE serverId=${serverId}`, function (err, results) {
            if (err) reject(err);

            const mpe = createMPE(results);
    
            bot.database.query(`INSERT INTO quoteMPEs (mpe, serverId) VALUES ('${JSON.stringify(mpe)}', '${serverId}')`, function (err, results) {
                if (err) reject(err.stack);
                resolve(mpe);
            });
        });
    });
}

async function rebuildMPE(bot, serverId) {
    return new Promise((resolve, reject) => {
        bot.database.query(`SELECT quoteKEY, quoteId, quote FROM quotes WHERE serverId=${serverId}`, function (err, results) {
            if (err) reject(err);

            const mpe = createMPE(results);
    
            bot.database.query(`UPDATE quoteMPEs mpe SET mpe='${JSON.stringify(mpe)}' WHERE serverId='${serverId}'`, function (err, results) {
                if (err) reject(err.stack);
                resolve(mpe);
            });
        });
    });
}

async function validateMPE(bot, serverId, mpe) {
    return new Promise((resolve, reject) => {
        bot.database.query(`SELECT MAX(quoteKEY) AS mKEY, COUNT(*) AS numRows FROM quotes WHERE serverId=${serverId}`, function (err, results) {
            if (err) reject(err);

            let valid = (mpe['largestPK'] == results[0]['mKEY']) & (mpe['num_quotes'] == results[0]['numRows']);
            resolve(valid);
        });
    });
}

module.exports = { 
    name: 'quotes',
    aliases: [],
    hidden: false,
    permissions: [],
    usage: 'quotes',
    description: 'Display quotes from the server and stream',
    category: 'Standard Commands',
    
    slash: new SlashCommandBuilder()
        .setName('quotes')
        .setDescription('Display quotes from the server and stream')
        .addSubcommand(subcommand =>
            subcommand.setName('view')
            .setDescription('View all quotes from this server!'))
        .addSubcommand(subcommand =>
            subcommand.setName('add')
            .setDescription('Add a quote to the list!')
            .addStringOption(option =>
                option.setName('quote')
                .setDescription('The quote to be added')
                .setRequired(true))),
    
    /** 
     * @param {Bot} bot 
     * @param {ChatInputCommandInteraction} interaction 
     */
    run: async (bot, interaction) => {
        switch (interaction.options.getSubcommand()) {
            case 'view':
                await interaction.deferReply();
        
                const mpeQuery = `SELECT mpe FROM quoteMPEs WHERE serverId=${interaction.guildId}`;
                bot.database.query(mpeQuery, async function (err, results) {
                    if (err) return console.error(err.stack);
        
                    let mpe = null;
        
                    if (!results.length) {
                        mpe = await buildMPE(bot, interaction.guildId);
                    } else {
                        mpe = JSON.parse(results[0]['mpe']);
        
                        if (!await validateMPE(bot, interaction.guildId, mpe)) {
                            mpe = await rebuildMPE(bot, interaction.guildId);
                        }
                    }
        
                    const embed = utils.getDefaultMessageEmbed(bot, { title:`Quotes Page [1/${mpe['num_pages']}]` });
                    mpe[`page_1`].forEach(x => {
                        embed.addFields({name: `#${x['quoteId']}`, value: `${x['quote']}` });
                    });
        
                    const row = new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId('quotePrevPage')
                                .setLabel('Previous Page')
                                .setStyle(ButtonStyle.Primary),
                            new ButtonBuilder()
                                .setCustomId('quoteNextPage')
                                .setLabel('Next Page')
                                .setStyle(ButtonStyle.Primary),
                            new ButtonBuilder()
                                .setCustomId('quoteDeleteEmbed')
                                .setLabel('Delete')
                                .setStyle(ButtonStyle.Danger),
                            );
        
                    interaction.editReply({ embeds: [ embed ], components: [ row ] });
                });
            break;
            case 'add':
                const quote = interaction.options.getString('quote');
                const maxQuery = `SELECT MAX(quoteId) as maxId FROM quotes WHERE serverId=${interaction.guildId}`
                bot.database.query(maxQuery, function (err, results) {
                    const quoteId = results[0]['maxId'];
                    
                    const query = `INSERT INTO quotes (serverId, quoteId, quote) VALUES (${interaction.guildId}, ${quoteId}, ? )`;
                    const args = [ quote ]
                    bot.database.query(query, args, function (err, results) {
                        if (err) return console.error(err.stack);
    
                        const embed = utils.getDefaultMessageEmbed(bot, { title:`Quote Added`, description: `**#${quoteId}:** ${quote}` });
    
                        interaction.reply({ embeds: [ embed ] })
                    });
                });
            break;
        }

    }
};