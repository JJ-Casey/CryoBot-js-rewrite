const colors = require("../utils/colors.js");
const utils = require("../utils/discordUtils.js");
const axios = require("axios");

function get_bearer_token(bot) {
  const headers = {
    "Content-Type": "application/x-www-form-urlencoded",
  };
  const data = {
    client_id: process.env.TWITCH_CLIENT_ID,
    client_secret: process.env.TWITCH_SECRET,
    grant_type: "client_credentials",
  };

  return (async () =>
    await axios
      .post("https://id.twitch.tv/oauth2/token", data, {
        headers: headers,
        cache: false,
      })
      .then((result) => {
        const response = result.data;
        const access_token = response.access_token;
        const expires_in = response.expires_in;
        const expires_at = Date.now() + expires_in;
        const token_type = response.token_type;

        bot.database.query(
          "INSERT INTO supersecrettokens (tokenName, tokenValue, expires) VALUES (?,?,?) ON DUPLICATE KEY UPDATE tokenValue=?, expires=?",
          [
            `twitch ${token_type}`,
            access_token,
            expires_at,
            access_token,
            expires_at,
          ]
        );
        return access_token;
      })
      .catch((err) => {
        console.log(err);
      }))();
}

module.exports = {
  name: "Twitch Live",
  start(bot) {
    function loop() {
      bot.database.query(
        "SELECT tokenValue, expires FROM supersecrettokens WHERE tokenName=?",
        ["twitch bearer"],
        function (err, results) {
          var access_token;
          if (results.length == 0) {
            access_token = get_bearer_token(bot);
            // console.log("New access token generated. Reason: Doesn't exist");
          } else {
            access_token = results[0]["tokenValue"];
            var expires = results[0]["expires"];

            if (Date.now() >= expires) {
              access_token = get_bearer_token(bot);
              // console.log("New access token generated. Reason: Expired");
            }
            // console.log(
            //   `Access token loaded. Expires in ${
            //     (expires - Date.now()) / 1000
            //   }s`
            // );
          }

          bot.database.query(
            "SELECT * FROM twitchnotification_log",
            function (err, results) {
              results.forEach((row) => {
                const serverId = row["serverID"];
                const username = row["twitchusername"];
                const notisent = row["notisent"];
                const channelId = row["channelID"];
                const messageId = row["messageId"];

                const target_url = `https://api.twitch.tv/helix/streams?user_login=${username}`;

                const headers = {
                  Authorization: `Bearer ${access_token}`,
                  "Client-Id": process.env.TWITCH_CLIENT_ID,
                };

                axios
                  .get(target_url, {
                    headers: headers,
                    cache: false,
                  })
                  .then((result) => {
                    const response = result.data;
                    const data = response.data[0];

                    if (data) {
                      if (!notisent) {
                        bot.guilds.cache
                          .get(`${serverId}`)
                          .channels.cache.get(`${channelId}`)
                          .send({
                            content: `<@&826016945635459135>`,
                            embeds: [
                              utils
                                .getDefaultMessageEmbed(bot, {
                                  title: `${data.user_name} is live!`,
                                  description: data.title,
                                })
                                .setURL(
                                  `https://www.twitch.tv/${data.user_login}`
                                )
                                .setImage(
                                  `${data.thumbnail_url
                                    .replace("{width}", "1920")
                                    .replace("{height}", "1080")}?${Date.now()}`
                                ),
                            ],
                          })
                          .then((message) => {
                            bot.database.query(
                              "UPDATE twitchnotifications SET notisent=1, messageId=? WHERE twitchusername=?",
                              [message.id, username]
                            );
                          });
                      } else {
                        bot.guilds.cache
                          .get(`${serverId}`)
                          .channels.cache.get(`${channelId}`)
                          .messages.fetch(`${messageId}`)
                          .then((message) => {
                            message.edit({
                              content: `<@&826016945635459135>`,
                              embeds: [
                                utils
                                  .getDefaultMessageEmbed(bot, {
                                    title: `${data.user_name} is live!`,
                                    description: data.title,
                                  })
                                  .setURL(
                                    `https://www.twitch.tv/${data.user_login}`
                                  )
                                  .setImage(
                                    `${data.thumbnail_url
                                      .replace("{width}", "1920")
                                      .replace(
                                        "{height}",
                                        "1080"
                                      )}?${Date.now()}`
                                  ),
                              ],
                            });
                          });
                      }
                    } else {
                      bot.database.query(
                        "UPDATE twitchnotifications SET notisent=0 WHERE twitchusername=?",
                        [username]
                      );
                    }
                  })
                  .catch((err) => {
                    console.log(err);
                  });
              });
            }
          );
        }
      );
    }
    loop();
    setInterval(loop, 1 * 30 * 1000);
  },
};
