const { BaseInteraction, Events } = require('discord.js');
const Bot = require('../../../Bot');
const perms = require('../../utils/perms.js')

function sanitise(cmdName) {
    const tokens = cmdName.split('-');
    const not_first_tokens = tokens.slice(1);

    if (!not_first_tokens.length) {
        return cmdName;
    }
    return tokens[0] + not_first_tokens.map(token => token.charAt(0).toUpperCase() + token.slice(1)).join('');
}

module.exports = {
    eventName: Events.InteractionCreate,
    /**
     * 
     * @param {Bot} bot 
     * @param {BaseInteraction} interaction 
     */
    callback: async (bot, interaction) => {
        if (!interaction.isChatInputCommand()) return;
        let cmd = sanitise(interaction.commandName);

        if (!interaction.guild) return;
        if (!interaction.member) interaction.member = await interaction.guild.members.fetch(interaction);

        if (!perms.checkIsOwner(interaction.member.id)) {
            return interaction.reply({ content: 'Commands are currently disabled', ephemeral: true });
        }

        if (cmd.length != 0) {
            let startTime = new Date();
            let preQuery, postQuery;
            let command = bot.slashCommands.get(cmd);
            if (command) {
                // Checks if there are permissions set in the database
                // If there are no roles, nor member, perms set, then allow the command to be ran
                let commandPermission = false;
                preQuery = new Date();

                // Chceking for role perms
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

                if (commandPermission) command.run(bot, interaction);
                else {
                    interaction.reply({ content: `You cannot run the \`${cmd}\` command.`, ephemeral: true })
                        .then(msg => { setTimeout(() => msg.delete(), 5000) })
                }
            }
            let endTime = new Date();
            if (false) console.log(`Total Execution time: ${endTime - startTime}ms\n
                        Time spent checking perms: ${postQuery - preQuery}ms\n
                        Time between query and end: ${endTime - preQuery}ms`);
        }
    }
}