const { ChatInputCommandInteraction } = require('discord.js');

class PermissionError extends Error {
    /** 
     * @param {ChatInputCommandInteraction} interaction 
     */
    constructor(interaction) {
        super("User does not have the right permissions");
        this.name = "PermissionError";
        this.interaction = interaction;
    }
}

module.exports = PermissionError