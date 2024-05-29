const Bot = require("../../Bot");
const { readdirSync } = require("fs");

module.exports = (bot) => {
  const timers = readdirSync("./src/timers").filter((file) =>
    file.endsWith(".js")
  );
  for (let timerFile of timers) {
    const timer = require(`../timers/${timerFile}`);
    bot.timers.set(timer.name, timer);
  }
};
