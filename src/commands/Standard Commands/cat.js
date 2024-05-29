const { BaseInteraction, SlashCommandBuilder } = require("discord.js");
const Bot = require("../../../Bot");
const { Random } = require("random-js");
const utils = require("../../utils/discordUtils.js");

responses = ["Hahaha Cat go *brrr*", "meow 🐱"];

module.exports = {
  name: "cat",
  usage: "cat",
  hidden: false,
  permissions: [],
  description: "Meow",
  category: "Standard Commands",

  slash: new SlashCommandBuilder().setName("cat").setDescription("Meow"),

  /**
   * @param {Bot} bot
   * @param {BaseInteraction} interaction
   */
  run: async (bot, interaction) => {
    return interaction.reply(`${new Random().pick(responses)}`);
  },
};
