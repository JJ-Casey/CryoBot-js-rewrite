const { ActivityType, Events } = require('discord.js');
const Bot = require('../../../Bot');
const colors = require('../../utils/colors.js');
const { prefix } = require('../../../config.json');
const chalk = require('chalk');
const dayjs = require('dayjs');
const utils = require('../../utils/discordUtils.js')

/**
 * `ready` event.
 * Triggers once the bot loads all the other events and goes online.
 * Useful to show ready messages and do/set things at startup.
 * 
 * @param {Bot} bot 
 */
module.exports = {
    eventName: Events.ClientReady,
    callback: async (bot) => {
        console.info(`${chalk.green('[Info]')} - ${bot.user.username} online!`);

        bot.database.query("SELECT channelId FROM log_channels WHERE logName='BOT_DEBUG' AND serverId=733676009374744707", function (err, result) {
            if (err) { throw err; }
            bot.guilds.cache.get('733676009374744707')
                .channels.cache.get(result[0].channelId)
                .send({ embeds: [ utils.getDefaultMessageEmbed(bot, { title: 'Booted up!', description: `${bot.user.username} is Online!` }) ] })
        });

        bot.timers.forEach(timer => {
            timer.start(bot);
        });

        // const artworkChannel = bot.guilds.cache.get('733676009374744707').channels.cache.get('733676206943371297');
        // artworkChannel.messages.fetch({ limit: 2 }).then(messages => {
        //         messages.forEach(message => {
        //             if (!message.author.bot &&
        //                 (message.attachments.size > 0 || message.embeds.length > 0) &&
        //                 !message.content.startsWith('https://tenor.com') &&
        //                 message.reactions.cache.filter(reaction => reaction == '👍' || reaction == '👎').size < 2) {
        //                     message.react('👍').then(() => message.react('👎'));
        //             }
        //         });
        //     }
        // );
        
        bot.user.setActivity('ban olympics', { type: ActivityType.Competing });

        // Populate members
        bot.guilds.fetch().then(guilds => {
            guilds.map(guild => guild.id).forEach(serverId => {
                bot.asyncQuery(`SELECT memberId FROM members WHERE serverId=${serverId}`).then(results => {
                    const sqlMembers = results.map(row => row['memberId']);
    
                    bot.guilds.fetch(serverId).then(guildSnowflake => {
                        guildSnowflake.fetch().then(guild => {
                            guild.members.fetch().then(members => {
                                members.filter(memb => !sqlMembers.includes(memb.id)).forEach(memb => {
                                    const isBot = memb.user.bot ? 1 : 0;
                                    const joinedAt = dayjs(memb.joinedAt).format('YYYY/MM/DD');
                                    bot.asyncQuery(`INSERT INTO members (serverId, memberId, bot, joinDate) VALUES ('${serverId}', '${memb.id}', '${isBot}', '${joinedAt}')`).catch(console.error);
                                });
                            }).catch(console.error);
                        }).catch(console.error);
                    }).catch(console.error);
                }).catch(console.error);
            });
        }).catch(console.error);
    }
};