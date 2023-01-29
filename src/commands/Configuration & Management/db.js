const { Message } = require('discord.js');
const Bot = require('../../../Bot');
const { ownerID } = require('../../../config.json');
const colors = require('../../utils/colors.js');
const utils = require('../../utils/discordUtils.js');
const perms = require('../../utils/perms.js');

module.exports = {
    name: 'db',
    hidden: true,
    permissions : [ perms.checkIsOwner() ],
    usage: 'db [SQL Query]',
    description: 'Execute SQL code to interact with the database.',
    category: 'Configuration & Management',

    /** 
     * @param {Bot} bot 
     * @param {Message} message 
     * @param {string[]} args 
     */
    run: async(bot, message, args) => {
        if (message.author.id !== ownerID) {
            return;
        }

        let query = args.join(' ');
        bot.database.query(query, function (err, result) {
            if (err){
                let embeds = [
                    utils.getDefaultMessageEmbed(bot, {title:'Error', color: colors.Red})
                        .setDescription(`${err}`).addField('Query', `Parsed query: ${query}`)
                ];
    
                return message.channel.send({ embeds });
            }

            let embed = utils.getDefaultMessageEmbed(bot, {title:'Database Query'})
                    .addFields('Query', `Parsed query: ${query}`);

            if (result.message) {
                embed.addField('Message', `DB Message: ${result.message}`);
            } else {
                try {
                    result.forEach(row => {
                        let val = 'For Each:\n';
                        for (let key in row) val += `**${key}**: ${row[key]}\n`;
                        embed.addField('Row', val)
                    });
                } catch {
                    let val = '';
                    for (let key in result) val += `**${key}**: ${result[key]}\n`;
                    embed.addField('Row', val)
                }
            }

            message.channel.send({ embeds: [embed] });
        });
    }
};