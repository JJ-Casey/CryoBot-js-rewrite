const { Message } = require('discord.js');
const Bot = require('../../../../Bot');

module.exports = {
    eventName: 'messageCreate',
    /**
     * 
     * @param {Bot} bot 
     * @param {Message} message 
     */
    callback: async (bot, message) => {
        if(message.author == bot) return;

        const cReactionKEY = await new Promise(((resolve) => {
            bot.database.query(`SELECT cReactionKEY FROM channelreactions WHERE serverId=${message.guildId} AND channelId=${message.channelId}`, function (err, results) {
                if (err) reject(err);

                if (results.length == 0) {
                    return resolve(null);
                }
                
                if (message.content.startsWith('https://tenor.com')) {
                    return resolve(null);
                }
                return resolve(results[0]['cReactionKEY']);
            });
        }));

        if (cReactionKEY == null) return;

        const reactions = await new Promise((resolve, reject) => {
            bot.database.query(`SELECT reacc FROM channelreactionsreaccs WHERE cReactionKEY=${cReactionKEY}`, function (err, results) {
                if (err) reject(err);
                resolve(results.map(row => row['reacc']));
            });
        });

        if (reactions.length == 0) return;
        
        if (message.attachments.size > 0) {
            reactions.map(reacc => async () => {message.react(reacc)}).reduce((prev, cur) => prev.then(cur), Promise.resolve());
            return;
        }
        if (message.content.startsWith('https://')) {
            await new Promise(resolve => setTimeout(resolve, 2 * 1000));
            
            if (message.embeds.length > 0) {
                reactions.map(reacc => async () => {message.react(reacc)}).reduce((prev, cur) => prev.then(cur), Promise.resolve());
            }
        }
    }
}

/**question: I've hear about circularity and something about referring to the same table in a subquery being a bit of a nono
That'd be something to handle in multiple queries, right?
E.g. not using autoincrement, but wanting to insert something based on the max value of a column + 1 */