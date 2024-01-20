const { Events } = require('discord.js');
const Bot = require('../../../Bot.js');
const colors = require('../../utils/colors.js');
const chalk = require('chalk');
const utils = require('../../utils/discordUtils.js')
const PermissionError = require('../../utils/permissionError.js')

/**
 * `ready` event.
 * Triggers once the bot loads all the other events and goes online.
 * Useful to show ready messages and do/set things at startup.
 * 
 * @param {Bot} bot 
 */
module.exports = {
    eventName: Events.Error,
    callback: async (bot, error) => {
        console.error(`${chalk.redBright('[Default Error Handler]')} - ${error.stack}`);

        if (error instanceof PermissionError) {
            const permErrResponseEmbed = utils.getDefaultMessageEmbed(bot, {
                title: 'Hold it there, Pardner',
                description: `You aint got permission to use that command`,
                color: colors.FireBrick
            });
            permErrResponseEmbed.setImage("https://c.tenor.com/c5a_h8U1MzkAAAAC/tenor.gif");

            return error.interaction.reply({ embeds: [permErrResponseEmbed] });
        }

        // Can we respond to something that triggered this?
        if (error.interaction) {
            const standardErrResponseEmbed = utils.getDefaultMessageEmbed(bot, { title: 'Error', description: utils.emptyEmbed, color: colors.FireBrick });
            standardErrResponseEmbed.addFields({ name: error.name, value: error.message });
            return error.interaction.reply({ embeds: [standardErrResponseEmbed] });
        }
    }
};