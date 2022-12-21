const { Message, Events } = require('discord.js');
const Bot = require('../../../Bot');
const { prefix } = require('../../../config.json');

module.exports = {
    eventName: Events.MessageCreate,
    /**
     * 
     * @param {Bot} bot 
     * @param {Message} message 
     */
    callback: async (bot, message) => {
        const args = message.content.slice(prefix.length).trim().split(/ +/g);
        const cmd = args.shift();

        if (message.author.bot) return;
        if (!message.guild) return;
        if (!message.member) message.member = await message.guild.members.fetch(message);
        if (cmd.length != 0) {
            let command = bot.commands.get(cmd);
            if(!command) command = bot.commands.get(bot.aliases.get(cmd));
            if(command && message.content.startsWith(prefix)) {
                let commandPermission = false;
                bot.database.query(`SELECT roleId, roleName FROM rolePermissions WHERE serverId=${message.guildId}`, (err, result) => {
                    const roleIds = result.map(row => row.roleId);
                    commandPermission |= !result.length | message.member.roles.cache.some(r => roleIds.includes(r.id));
                });
                bot.database.query(`SELECT userId FROM memberPermissions WHERE serverId=${message.guildId}`, (err, result) => {
                    const userIds = result.map(row => row.userId);
                    commandPermission |= !result.length | userIds.includes(message.member.id);
                });
                commandPermission |= command.permissions.length > 0 ? command.permissions.some(check => check(message.member)) : true;
                
                if (commandPermission) command.run(bot, message, args);
            }
        }
    }
}