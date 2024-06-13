const { Message } = require("discord.js");
const Bot = require("../../Bot");
const colors = require("../utils/colors.js");
const utils = require("../utils/discordUtils.js");

module.exports = {
  name: "Member Updater",
  start(bot) {
    function loop() {
      bot.guilds
        .fetch()
        .then((guilds) => {
          guilds
            .map((guild) => guild.id)
            .forEach((serverId) => {
              // query the database for members already on record
              bot
                .asyncQuery(
                  `SELECT memberId FROM members WHERE serverId=${serverId}`
                )
                .then((results) => {
                  const sqlMemberIDs = results.map((row) => row["memberId"]);

                  // get the servers from the bot
                  bot.guilds
                    .fetch(serverId)
                    .then((guildSnowflake) => {
                      guildSnowflake
                        .fetch()
                        .then((guild) => {
                          // grab all members from the servers
                          guild.members
                            .fetch()
                            .then((members) => {
                              // Filter based on if the server members are not in the db already
                              members
                                .filter(
                                  (memb) => !sqlMemberIDs.includes(memb.id)
                                )
                                .forEach((memb) => {
                                  const isBot = memb.user.bot ? 1 : 0;
                                  const joinedAt = dayjs(memb.joinedAt).format(
                                    "YYYY/MM/DD"
                                  );
                                  bot
                                    .asyncQuery(
                                      `INSERT INTO members (serverId, memberId, bot, joinDate) VALUES ('${serverId}', '${memb.id}', '${isBot}', '${joinedAt}')`
                                    )
                                    .catch(console.error);
                                });
                              // Filter based on if the server members are in the db but no longer in the server
                              sqlMemberIDs
                                .filter(
                                  (sqlMembID) =>
                                    !members
                                      .map((memb) => memb.id)
                                      .includes(sqlMembID)
                                )
                                .forEach((membId) => {
                                  bot
                                    .asyncQuery(
                                      "DELETE FROM members WHERE serverId=? AND memberId=?",
                                      [serverId, membId]
                                    )
                                    .catch(console.error);
                                });
                            })
                            .catch(console.error);
                        })
                        .catch(console.error);
                    })
                    .catch(console.error);
                })
                .catch(console.error);
            });
        })
        .catch(console.error);
    }
    loop();
    setInterval(loop, 10 * 60 * 1000);
  },
};
