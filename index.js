// Modules
const Bot = require('./Bot');
require('dotenv').config({ path: './.env'});
const chalk = require('chalk');
const { readdirSync } = require('fs');
const { stripIndents } = require('common-tags');

// Client
const bot = new Bot();

// Debugging
// bot.on('raw', console.log);
// bot.on('debug', m => console.log(`${chalk.cyan('[Debug]')} - ${m}`));
bot.on('rateLimit', rl => console.warn(
    stripIndents`${chalk.yellow('[Ratelimit]')}
    Timeout: ${rl.timeout}
    Limit: ${rl.limit}
    Route: ${rl.route}`));
bot.on('warn', w => console.warn(`${chalk.yellow('[Warn]')} - ${w}`));
bot.on('error', e => console.error(`${chalk.redBright('[Error]')} - ${e.stack}`));
process.on('uncaughtException', e => console.error(`${chalk.redBright('[Error]')} - ${e.stack}`));
process.on('unhandledRejection', e => console.error(`${chalk.redBright('[Error]')} - ${e.stack}`));
process.on('warning', e => console.warn(`${chalk.yellow('[Error]')} - ${e.stack}`));
process.on('exit', () => { bot.database.end() });
process.on('SIGINT', () => { bot.database.end() });
process.on('SIGUSR1', () => { bot.database.end() });
process.on('SIGUSR2', () => { bot.database.end() });

// Handlers' modules
readdirSync('./src/handlers').forEach(handler => {
    require(`./src/handlers/${handler}`)(bot);
});

// Login and turn on (default is DISCORD_TOKEN)
bot.login();
