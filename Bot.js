const { Client, Collection, GatewayIntentBits, Partials } = require('discord.js');
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
                GatewayIntentBits.GuildMessageReactions
            ],
            partials: [Partials.Message, Partials.Channel, Partials.Reaction]
        });

        this.slashCommands = new Collection();
        this.commands = new Collection();
        this.aliases = new Collection();
        this.categories = fs.readdirSync('./src/commands')
            .filter(f => fs.readdirSync(`./src/commands/${f}`).length > 0);
        this.timers = new Collection();
        this.database = mysql.createPool(process.env.DATABASE_URI);
        this.asyncQuery = async (query, args) => {
            return new Promise((resolve, reject) => {
                this.database.query(query, args, function (err, results) {
                    if (err) { reject(err); }
                    resolve(results);
                });
            });
        }
    }
};
module.exports = Bot;