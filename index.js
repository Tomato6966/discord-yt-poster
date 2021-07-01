//importing the files
const YTP = require("./lib/YoutubePoster");
//function for generating a new meme
function YoutubePoster(client, options) {
    return new YTP(client, options);
}
YTP.YoutubePoster = YoutubePoster;
YTP.version = require("./package.json").version;

//exporting this meme
module.exports = YoutubePoster;