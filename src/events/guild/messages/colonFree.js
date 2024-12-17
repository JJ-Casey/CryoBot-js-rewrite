const { Message } = require("discord.js");
const { ownerID } = require("../../../../config.json");
const { Random } = require("random-js");
const Bot = require("../../../../Bot");

const rng = new Random();

colonFree = "<a:colonfree:1277765519709175858>";

module.exports = {
  eventName: "messageCreate",
  /**
   *
   * @param {Bot} bot
   * @param {Message} message
   */
  callback: async (bot, message) => {
    if (message.author.bot) return;
    if (!message.inGuild()) return;

    if (message.content.includes(colonFree)) {
      bot.database.getConnection((errConn, connection) => {
        if (errConn) {
          connection.release();
          throw errConn;
        }

        connection.beginTransaction(function (err) {
          if (err) {
            connection.release();
            return console.error(err);
          }
          connection.query(
            "SELECT timestamp,cooldown FROM genericCooldowns WHERE cooldownName=?",
            ["colonFree"],
            function (err1, results) {
              if (err1) {
                return connection.rollback(function () {
                  connection.release();
                  console.error(err1);
                });
              }

              let canSend = false;

              if (results.length == 0) {
                canSend = true;
              } else {
                canSend =
                  Date.now() - results[0]["timestamp"] > results[0]["cooldown"];
              }

              if (canSend) {
                let newCooldown = rng.integer(1, 4) * 30 * 1000;

                message.channel.send(colonFree).then((msg) => {
                  connection.query(
                    "INSERT INTO genericCooldowns (cooldownName,timestamp,cooldown) VALUES (?,?,?) ON DUPLICATE KEY UPDATE timestamp=?,cooldown=?",
                    [
                      "colonFree",
                      msg.createdTimestamp,
                      newCooldown,
                      msg.createdTimestamp,
                      newCooldown,
                    ],
                    (err2, res) => {
                      if (err2) {
                        return connection.rollback(function () {
                          connection.release();
                          console.error(err2);
                        });
                      }
                      connection.commit(function (err3) {
                        if (err3) {
                          return connection.rollback(function () {
                            connection.release();
                            throw err3;
                          });
                        }
                        connection.release();
                      });
                    }
                  );
                });
              }
            }
          );
        });
      });
    }
  },
};
