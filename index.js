// Modules
const Bot = require('./Bot');
require('dotenv').config({ path: './.env'});
const { readdirSync } = require('fs');
const { stripIndents } = require('common-tags');

// Client
const bot = new Bot();

// Debugging
bot.on('rateLimit', rl => console.warn(
    stripIndents`'[Ratelimit]'
    Timeout: ${rl.timeout}
    Limit: ${rl.limit}
    Route: ${rl.route}`));
bot.on('warn', w => console.warn(`[Warn] - ${w}`));
// bot.on('error', e => console.error(`${chalk.redBright('[Default Error]')} - ${e.stack}`));
process.on('uncaughtException', e => console.error(`[Uncaught Error] - ${e.stack}`));
process.on('unhandledRejection', e => console.error(`[Rejection Error] - ${e.stack}`));
process.on('warning', e => console.warn(`[Warning/Error] - ${e.stack}`));
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