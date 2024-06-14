const fs = require("fs");
const path = require("path");

let colorsJSON = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, "../../colors.json"))
);

for (x in colorsJSON) {
  colorsJSON[x] = parseInt(colorsJSON[x].slice(1), 16);
}
// "DefaultEmbed": "#FF69B4",

module.exports = colorsJSON;
