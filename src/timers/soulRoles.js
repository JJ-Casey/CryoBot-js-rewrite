const { Message } = require('discord.js');
const Bot = require('../../Bot');
const colors = require('../utils/colors.js');
const utils = require('../utils/discordUtils.js');
const dayjs = require('dayjs');
var duration = require('dayjs/plugin/duration')
dayjs.extend(duration)

const lost_id = '738395399458390058';
const regular_id = '764511979133337611';
const modern_id = '764511954769018900';
const ancient_id = '764512609542078504';

module.exports = {
    start(bot) {
        async function checkSoulLifetime() {
            // var role = bot.guild.roles.cache.find(role => role.id === "role name");
            // member.roles.add(role);
            const now = dayjs();
   
            const embed = utils.getDefaultMessageEmbed(bot, { title: 'Members' })
            const members = await bot.guilds.cache.get('733676009374744707').members.fetch();
            members.forEach(member => {
                if (member.user.bot) { return; }
                const joined = dayjs(member.joinedAt);
                const timeDiff = now.diff(joined, 'week');

                var value = `Time since joined: ${timeDiff} weeks`
                if (timeDiff >= 52) {
                    value = 'This user is an Ancient Soul'
                } else if (timeDiff >= 25) {
                    value = 'This user is a Modern Soul'
                } else if (timeDiff >= 4) {
                    value = 'This user is a Regular Soul'
                }
                embed.addField(member.displayName, value);
                });
            bot.channels.cache.get('733676206943371297').send({ embeds: [embed] });
        }
        setImmediate(checkSoulLifetime)
        setInterval(checkSoulLifetime, 86400 * 1000)
    }}