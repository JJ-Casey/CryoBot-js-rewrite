const { BaseInteraction, Events } = require('discord.js');
const Bot = require('../../../Bot');

module.exports = {
    eventName: Events.InteractionCreate,
    /**
     * 
     * @param {Bot} bot 
     * @param {BaseInteraction} interaction 
     */
    callback: async (bot, interaction) => {
        if (!interaction.isChatInputCommand()) return;

        const cmd = interaction.commandName

        if (!interaction.guild) return;
        if (!interaction.member) interaction.member = await interaction.guild.members.fetch(interaction);
        if (cmd.length != 0) {
            let command = bot.slashCommands.get(cmd);
            if(command) {
                let commandPermission = false;
                bot.database.query(`SELECT roleId, roleName FROM rolePermissions WHERE serverId=${interaction.guildId}`, (err, result) => {
                    const roleIds = result.map(row => row.roleId);
                    commandPermission |= !result.length | interaction.member.roles.cache.some(r => roleIds.includes(r.id));
                });
                bot.database.query(`SELECT userId FROM memberPermissions WHERE serverId=${interaction.guildId}`, (err, result) => {
                    const userIds = result.map(row => row.userId);
                    commandPermission |= !result.length | userIds.includes(interaction.member.id);
                });
                commandPermission |= command.permissions.length > 0 ? command.permissions.some(check => check(interaction.member)) : true;
                
                if (commandPermission) command.run(bot, interaction);
            }
        }
    }
}