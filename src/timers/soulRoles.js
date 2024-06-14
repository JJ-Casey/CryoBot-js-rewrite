const { Message } = require("discord.js");
const Bot = require("../../Bot");
const utils = require("../utils/discordUtils.js");
const dayjs = require("dayjs");
var duration = require("dayjs/plugin/duration");
dayjs.extend(duration);

// These are the real ones
const lost_id = "738395399458390058";
const regular_id = "764511979133337611";
const modern_id = "764511954769018900";
const ancient_id = "764512609542078504";

const cryo_server_id = "724753586461868132";
const jj_server_id = "733676009374744707";

module.exports = {
  name: "Soul Roles",
  start(bot) {
    async function checkSoulLifetime() {
      // For the cryo server only
      var guild = bot.guilds.cache.get(cryo_server_id);
      var members = await guild.members.fetch(); // Check the database instead?

      // // Lost Soul
      // var lost_id = "737673361450205214";
      // // Regular Soul
      // var regular_id = "737673360472801342";
      // // Modern Soul
      // var modern_id = "737673359873277992";
      // // Ancient Soul
      // var ancient_id = "737652008382890066";

      bot.database.query(
        `SELECT memberId, joinDate FROM members WHERE serverId=? AND bot='0'`,
        [cryo_server_id],
        function (err, results) {
          const now = dayjs();

          results
            .map((row) => ({ id: row["memberId"], joinedAt: row["joinDate"] }))
            .forEach((member) => {
              try {
                const joined = dayjs(member.joinedAt);
                const timeDiff = now.diff(joined, "week");

                const memb_info = members.find((memb) => memb.id === member.id);
                if (memb_info === undefined) return;
                const memb_roles = memb_info.roles;

                if (timeDiff >= 52) {
                  memb_roles.add(ancient_id, "Lifetime in server");
                  memb_roles.remove(
                    [modern_id, regular_id, lost_id],
                    "Lifetime in server exceeded"
                  );
                } else if (timeDiff >= 25) {
                  memb_roles.add(modern_id, "Lifetime in server");
                  memb_roles.remove(
                    [regular_id, lost_id],
                    "Lifetime in server exceeded"
                  );
                } else if (timeDiff >= 4) {
                  memb_roles.add(regular_id, "Lifetime in server");
                  memb_roles.remove(lost_id, "Lifetime in server exceeded");
                } else {
                  memb_roles.add(lost_id, "Lifetime in server");
                }
              } catch (err) {
                console.error(err);
              }
            });
        }
      );
    }
    checkSoulLifetime();
    setInterval(checkSoulLifetime, 3 * 60 * 60 * 1000);
  },
};
