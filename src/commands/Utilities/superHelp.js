const { Message } = require('discord.js');
const Bot = require('../../../Bot');
const { readdirSync } = require('fs');
const { prefix } = require('../../../config.json');
const colors = require('../../utils/colors.js');
const perms = require('../../utils/perms.js');
const utils = require('../../utils/discordUtils.js')

module.exports = { 
    name: 'superHelp',
    aliases: ['commands'],
    usage: 'superHelp (command)',
    hidden: true,
    permissions : [ perms.checkIsOwner(), perms.checkIsAdministrator() ],
    description: 'Shows list of super secret hidden commands',
    category: 'Utilities',
    
    /** 
     * @param {Bot} bot 
     * @param {Message} message 
     * @param {string[]} args 
     */
    run: async (bot, message, args) => {
        if (args[0]) {
            return getCmd(bot, message, args[0]);
        } else {
            return getAll(bot, message);
        }
    }
};

function getAll(bot, message) {
    const embed = utils.getDefaultMessageEmbed(bot)
        .setColor(colors.Orange)
        .setFooter({ text: 'Syntax: () = optional, [] = required, {a, b} = choose between a or b', iconURL: bot.user.displayAvatarURL({ dynamic: true}) });
    
    /* bot.categories is an array
    Basically, this reads recursively each directory from src/commands
    Then, for each category, it adds a field to the embed with the name and its commands */
    let ignored_categories = [ ]
    bot.categories.forEach(category => {
        if (ignored_categories.includes(category)) { return; }
        let filesArr = readdirSync(`./src/commands/${category}`)
            .filter(file => file.endsWith('.js')); // Accepts only .js files 
 
        embed.addField(category, 
            filesArr
                .map(file => file.substring(0, file.length - 3)) // Removes the .js
                // .filter(cmd => !bot.commands.get(cmd.toLowerCase()).hidden) // Removes the ones with a hidden property
                .map(str => `\`${str}\``) // Formats the names to include monospace
                .join(' ')); // Joints them by spaces instead of newlines

    });

    // After they're all added, send it
    return message.channel.send({ embeds: [embed] });
}

function getCmd(bot, message, input) {
    const embed = utils.getDefaultMessageEmbed(bot)
        .setColor(colors.SteelBlue)
        .setFooter({ text: 'Syntax: () = optional; [] = required; {a, b} = choose between a or b', iconURL: bot.user.displayAvatarURL({ dynamic: true}) });

    // Fetching the command data through bot.commands or bot.aliases
    const cmd = bot.commands.get(input.toLowerCase()) || bot.commands.get(bot.aliases.get(input.toLowerCase()));

    // If the command isn't found (likely doesn't exist)
    if(!cmd) {
        return message.channel.send(`**${input.toLowerCase()}** is not a command?`);
    }

    // Adds its name based on helpName || uppercase name
    if(cmd.name) embed.setDescription(`**${cmd.helpName ? cmd.helpName : cmd.name[0].toUpperCase() + cmd.name.slice(1)} Command**`);
    // Adds aliases by mapping them
    if(cmd.aliases) embed.addField('Aliases', `${cmd.aliases.map(a => `\`${a}\``).join(' ')}`);
    // The description
    if(cmd.description) embed.addField('Description', `${cmd.description}`);
    // The usage
    if(cmd.usage) embed.addField('Usage', `\`${prefix}${cmd.usage}\``);

    return message.channel.send({ embeds: [embed] });
}