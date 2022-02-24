const { Message, MessageEmbed } = require('discord.js');
const Bot = require('../../../Bot');
const { Random } = require("random-js");
const utils = require('../../utils/discordUtils.js')

responses = ['Hahaha Cat go *brrr*', 'meow 🐱'];

module.exports = { 
    name: 'cat',
    usage: 'cat',
    description: 'Meow',
    
    /** 
     * @param {Bot} bot 
     * @param {Message} message 
     */
    run: async (bot, message) => {
        return message.channel.send(`${new Random().pick(responses)}`);
    }
};