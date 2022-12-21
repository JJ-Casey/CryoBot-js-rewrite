const { Client, Collection, GatewayIntentBits } = require('discord.js');
const fs = require('fs');
const mysql = require('mysql');

const Bot = class extends Client {
    constructor() {
        super({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent,
                GatewayIntentBits.GuildMembers,
            ],
            partials: ['REACTION']
        });

        this.slashCommands = new Collection();
        this.commands = new Collection();
        this.aliases = new Collection();
        this.categories = fs.readdirSync('./src/commands')
            .filter(f => fs.readdirSync(`./src/commands/${f}`).length > 0);
        this.timers = new Collection();
        this.database = mysql.createPool(process.env.DATABASE_URI);
    }
};
module.exports = Bot;