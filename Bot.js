const { Client, Collection, Intents: { FLAGS } } = require('discord.js');
const fs = require('fs');

const Bot = class extends Client {
    constructor() {
        super({
            intents: [
                FLAGS.GUILDS,
                FLAGS.GUILD_MESSAGES,
                // FLAGS.GUILD_MEMBERS // only if needed, you need to enable the intent in your application first
            ]
        });

        this.commands = new Collection();
        this.aliases = new Collection();
        this.categories = fs.readdirSync('./src/commands')
            .filter(f => fs.readdirSync(`./src/commands/${f}`).length > 0);
    }
};
module.exports = Bot;