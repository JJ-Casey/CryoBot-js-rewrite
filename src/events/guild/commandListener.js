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
            let startTime = new Date();
            let preQuery, postQuery;
            let command = bot.commands.get(cmd);
            if (!command) command = bot.commands.get(bot.aliases.get(cmd));
            if (command && message.content.startsWith(prefix)) {
                let commandPermission = false;
                preQuery = new Date();

                const results_roleperms = await bot.asyncQuery(`SELECT roleId FROM rolePermissions WHERE serverId=? AND commandName=?`, [interaction.guildId, command.name])
                const roleIds = results_roleperms.map(row => row.roleId);
                commandPermission |= !results_roleperms.length | interaction.member.roles.cache.some(r => roleIds.includes(r.id));

                // Checking for user perms
                const results_userperms = await bot.asyncQuery(`SELECT userId FROM memberPermissions WHERE serverId=? AND commandName=?`, [interaction.guildId, command.name])
                const userIds = results_userperms.map(row => row.userId);
                commandPermission |= !results_userperms.length | userIds.includes(interaction.member.id);

                // Checking for hard-coded permissions
                commandPermission &= command.permissions.length > 0 ? command.permissions.some(check => check(interaction.member)) : commandPermission;

                postQuery = new Date();

                if (commandPermission) command.run(bot, message, args);
            }
            let endTime = new Date();
            if (false) console.log(`Total Execution time: ${endTime - startTime}ms\n
                        Time spent checking perms: ${postQuery - preQuery}ms\n
                        Time between query and end: ${endTime - preQuery}ms`);
        }
    }
}