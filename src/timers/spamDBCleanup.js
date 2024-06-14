const { Message } = require("discord.js");
const Bot = require("../../Bot");
const utils = require("../utils/discordUtils.js");

module.exports = {
  name: "Spam DB Cleanup",
  start(bot) {
    function loop() {
      bot.database.query(
        "SELECT DISTINCT memberKEY FROM messageModeration",
        function (err, results) {
          results
            .map((row) => row["memberKEY"])
            .forEach((memberKEY) => {
              // Clear up the extra messages
              bot.database.query(
                "SELECT x.messageKEY FROM messageModeration AS x LEFT JOIN (SELECT m.messageKEY FROM messageModeration AS m WHERE m.memberKEY=? ORDER BY m.timestamp DESC LIMIT 5) AS y ON x.messageKEY = y.messageKEY WHERE y.messageKEY IS NULL",
                [memberKEY],
                function (err, res) {
                  if (err) {
                    console.log(JSON.stringify(err));
                    return utils.raiseError(bot, err);
                  }

                  const keys_to_delete = res.map((row) => row["messageKEY"]);
                  if (keys_to_delete.length == 0) {
                    return;
                  }
                  bot.database.query(
                    "DELETE FROM messageModeration WHERE messageKEY IN (?)",
                    [keys_to_delete],
                    function (errdelete) {
                      if (errdelete) {
                        console.log(JSON.stringify(errdelete));
                        return utils.raiseError(bot, errdelete);
                      }
                    }
                  );
                }
              );

              // Reset numTimeouts if enough time has passed
              bot.database.query(
                "SELECT * FROM moderation WHERE memberKEY=?",
                [memberKEY],
                function (err, res) {
                  if (res.length == 0) {
                    return;
                  }
                  const currTimestamp = Date.now();
                  const lastTimeout = res[0]["whentimeout"];
                  const numTimeouts = Number(res[0]["numTimeouts"]);
                  if (
                    currTimestamp >=
                    lastTimeout + 5 * 2 ** numTimeouts * 1000 + 2 * 60 * 1000
                  ) {
                    // User has not been caught spamming for 2 minutes after their last time out, reset their timeout cooldown
                    bot.database.query(
                      "DELETE FROM moderation WHERE memberKEY=?",
                      [memberKEY],
                      function (e, r) {
                        if (e) {
                          console.log(JSON.stringify(e));
                          return utils.raiseError(bot, e);
                        }
                      }
                    );
                  }
                }
              );
            });
        }
      );
    }
    loop();
    setInterval(loop, 1 * 60 * 1000);

    // Periodically clean up the `messageModeration` db, limiting to 5 messages/rows per memberKEY
    // Then, check `moderation` db and reset numTimeouts if current timestamp is >= whentimeout + 2**numTimeouts(seconds) + 2(minutes)
  },
};
