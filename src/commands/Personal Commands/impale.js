const { ChatInputCommandInteraction, SlashCommandBuilder, Collection } = require('discord.js');
const Bot = require('../../../Bot');
const colors = require('../../utils/colors.js');
const perms = require('../../utils/perms.js');
const utils = require('../../utils/discordUtils.js')

module.exports = { 
    name: 'impale',
    usage: 'impale [user]',
    hidden: true,
    permissions: [ perms.checkIsAdministrator() ],
    description: 'Sends someone to the shadow realm',
    category: 'Personal Commands',

    slash: new SlashCommandBuilder()
        .setName('impale')
        .setDescription('Sends someone to the shadow realm')
        .addUserOption(option => 
            option.setName('target')
                .setDescription('The poor soul being impaled')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('The reason for their impalement')),
    
    /** 
     * @param {Bot} bot 
     * @param {ChatInputCommandInteraction} interaction 
     */
    run: async (bot, interaction) => {
        const target = interaction.options.getUser('target');
        const reason = interaction.options.getString('reason') ?? 'Mitzy was too hungry to give a reason...';

        // ban

        // 398957705294774272
        const responseEmbed = utils.getDefaultMessageEmbed(bot, { title:'', description:'Mitzy has claimed another soul!', color: colors.FireBrick });

        interaction.guild.members.fetch('235467134581342208')
            .then(mitzy => {
                responseEmbed.setThumbnail(mitzy.displayAvatarURL({ dynamic: true }));
                interaction.reply({ embeds: [responseEmbed] });
        
                const logEmbed = utils.getDefaultMessageEmbed(bot, { title:'', description:'Mitzy has claimed another soul!' });
                logEmbed.addFields(
                    { name: 'User', value: `${target}`, inline: true },
                    { name: 'Moderator', value: `${interaction.member}`, inline: true },
                    { name: 'Reason', value: `${reason}`, inline: true }
                    );
                logEmbed.setThumbnail(target.displayAvatarURL({ dynamic: true }));
                
                bot.database.query("SELECT channelId FROM log_channels WHERE logName='BOT_DEBUG' AND serverId=733676009374744707", function (err, result) {
                    if (err) { throw err; }
                    bot.guilds.cache.get('733676009374744707')
                        .channels.cache.get(result[0].channelId)
                        .send({ embeds: [ logEmbed ] })
                });
            });
    }
};