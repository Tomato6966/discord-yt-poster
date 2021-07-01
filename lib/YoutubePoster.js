//Import the Utils
const Discord = require("discord.js");
const Josh = require("@joshdb/core");
const Parser = require("rss-parser");
const parser = new Parser();
const colors = require("colors")
const YoutubeLogger = require('./youtubelogger.js');
const Util = require('./Util.js');
const {
    channelInfo
} = require('./channelInfo.js')
const JoshJSON = require('@joshdb/json'); //default Provider but there are also many other things like mongodb sqlite and more!
//swap the provider: https://josh.evie.dev/providers/about

//MAKE SURE TO INSTALL THE GIVEN PROVIDER TOO!, @joshdb/json @joshdb/mongo are already installed but sqlite etc. not, this is to support REPLIT etc.
class YoutubePoster {
    constructor(client, options) {
        //get the log string
        this.ytp_log = `[Discord-YoutubePoster] :: `.bold.brightRed;
        //set the options
        if (!client) {
            throw new Error("No Valid DiscordClient Added")
        }
        this.client = client;
        this.options = {
            loop_delays_in_min: 5,
            defaults: {
                Notification: "<@{discorduser}> Posted: **{videotitle}**, as \`{videoauthorname}\`\n{videourl}"
            },
            //provider: JoshJSON, //change this so its using your own providor!
            //providerOptions: {},
        }
        //set the global memer variable for the version
        this.version = require("../package.json").version;
        //set the author variable for the creators
        this.author = "Tomato6966";
        this.discord = "https://discord.gg/FQGXbypRf8";
        //set the author variable for the creators
        this.github = "https://github.com/Tomato6966/discord-yt-poster/wiki";
        //loop through the custom object
        if (options) {
            if(options.loop_delays_in_min){
                if(typeof options.loop_delays_in_min != "number") throw new SyntaxError("options#loop_delays_in_min must be a NUMBER, you provided: " + typeof options.loop_delays_in_min)
                let dela = Number(options.loop_delays_in_min)
                if(dela < 0) throw new SyntaxError("options#loop_delays_in_min must be BIGGER or EQUAL then 0, you provided: " + options.loop_delays_in_min)
                if(dela > 59) throw new SyntaxError("options#loop_delays_in_min must be SMALLER then 0, you provided: " + options.loop_delays_in_min)
                this.options.loop_delays_in_min = dela;
                console.log(this.ytp_log + `Using custom Option#loop_delays_in_min: ${this.options.loop_delays_in_min}`.bold.green);
            }
            if(options.defaults){
                if(options.defaults.Notification){
                    this.defaults.Notification = options.defaults.Notification;
                    console.log(this.ytp_log + `Using custom Option#defaults#Notification: ${this.defaults.Notification}`.bold.green);
                }
            }
            if(options.provider){
                this.provider = options.provider
                console.log(this.ytp_log + `Using custom Option#provider`.bold.green);
            }
            if(options.providerOptions){
                this.providerOptions = options.providerOptions
                console.log(this.ytp_log + `Using custom Option#providerOptions`.bold.green);
            }
        }
        //if no method added, use this, throw error
        if (!this.constructor && !this.constructor.name) {
            throw new Error(`The ${this.constructor.name} class may not be instantiated!`);
        }
        //
        this.createProvider();
        //create the logger
        YoutubeLogger(this)
    }

    createProvider() {
        if (this.options) {
            if (!this.options.providerOptions && typeof this.options.providerOptions !== "object") {
                console.log(this.ytp_log + "No Provider Options granted here is an Example for MongoDB: { providerOptions: { url: 'mongodb://localhost' } }, if you use JoshJSON, then give it an EMPTY OBJECT".bold.yellow)
                try {
                    console.log(this.ytp_log + `No Valid Database Options added, using JSON.`.bold.yellow);
                    this.YTP_DB = new Josh({
                        name: 'Discord-YoutubePoster',
                        provider: JoshJSON,
                        providerOptions: {},
                    });
                    this.YTP_DB.defer.then(async () => {
                        console.log(this.ytp_log + `Connected the JSON-Database. There are: ${await this.YTP_DB.size} Rows/Entries`.bold.green);
                    });
                } catch (error) {
                    this.YTP_DB = false;
                    throw error
                }
            } else {
                //use custom Options
                try {
                    this.YTP_DB = new Josh({
                        name: 'Discord-YoutubePoster',
                        provider: this.options.provider,
                        providerOptions: this.options.providerOptions
                    });
                    this.YTP_DB.defer.then(async () => {
                        console.log(this.ytp_log + `Connected the database.`.bold.green);
                    });
                } catch (error) {
                    this.YTP_DB = false;
                    throw error
                }
            }

        } else {
            try {
                console.log(this.ytp_log + `No ${"CUSTOM".underline} Database Options added, using JSON.`.bold.yellow);
                this.YTP_DB = new Josh({
                    name: 'Discord-YoutubePoster',
                    provider: JoshJSON,
                    providerOptions: {},
                });
                this.YTP_DB.defer.then(async () => {
                    console.log(this.ytp_log + `Connected the JSON-Database. There are: ${await this.YTP_DB.size} Rows/Entries`.green);
                });
            } catch (error) {
                this.YTP_DB = false;
                throw error
            }
        };
        //if no db found throw error
        if (!this.YTP_DB) {
            throw new Error(`Failed creating the Database`);
        }
        return this;
    }


    /** Set a new YTChannel to a Guild ID
     * @param {string} ChannelLink Youtube Channel Link, example: https://youtube.com/c/Tomato6966
     * @param {OBJECT|DiscordChannel} DiscordChannel DiscordChannel with ID && guild parameters
     * @param {OBJECT|DiscordUser} DiscordUser DiscordUser with ID parameter. who owns the Link
     * @param {string} Notification Notification Message | OPTIONAL | DEFAULT: uses the options
     * @param {Boolean} preventDuplicates Default: True
     * returns: https://github.com/Tomato6966/discord-yt-poster/wiki/Response-setChannel
     */
    async setChannel(ChannelLink, DiscordChannel, DiscordUser, Notification = this.options.defaults.Notification, preventDuplicates = true) {
        return new Promise(async (res, rej) => {
            try {
                if (!ChannelLink) return rej("A String is required for the ChannelLink");
                if (typeof ChannelLink !== "string") return rej(`Passed in ${typeof ChannelLink} but a String would be required for the ChannelLink`);
                if (!Util.isValidURL(ChannelLink)) return rej(`${ChannelLink} is not a Valid URL (YT)`);
                if (!DiscordChannel || !DiscordChannel.guild || !DiscordChannel.id) return rej("A DiscordChannel with Guild Information is required!");
                await this.YTP_DB.ensure(DiscordChannel.guild.id, {
                    channels: []
                });
                await Util.delay(200);
                let channels = await this.YTP_DB.get(`${DiscordChannel.guild.id}.channels`);
                let CHdata = channels.find(v => v.YTchannel.split("/")[v.YTchannel.split("/").length - 1] == ChannelLink.split("/")[ChannelLink.split("/").length - 1])
                if (preventDuplicates && CHdata) {
                    rej(`Channel already setup for the Guild: ${DiscordChannel.guild.id} yet:\n` + JSON.stringify(CHdata, null, 3))
                    return;
                }
                let newChannelData = {
                    YTchannel: ChannelLink,
                    DiscordGuild: DiscordChannel.guild.id,
                    DiscordChannel: DiscordChannel.id,
                    DiscordUser: DiscordUser ? DiscordUser.id : "",
                    oldvid: "",
                    alrsent: [],
                    message: Notification
                }
                channels.push(newChannelData)
                await this.YTP_DB.set(`${DiscordChannel.guild.id}.channels`, channels);
                let data = await this.YTP_DB.get(`${DiscordChannel.guild.id}.channels`);
                var Obj = {};
                Obj = newChannelData;
                Obj.allChannels = data;
                return res(Obj);
            } catch (error) {
                return rej(error);
            }
        })
    }


    /** Get Channel Information about a LINK
     * @param {string} ChannelLink Youtube Channel Link, example: https://youtube.com/c/Tomato6966
     * returns: https://github.com/Tomato6966/discord-yt-poster/wiki/Response-getChannelInfo
     */
    async getChannelInfo(ChannelLink) {
        return new Promise(async (res, rej) => {
            try {
                if (!ChannelLink) return rej("A String is required for the ChannelLink");
                if (typeof ChannelLink !== "string") return rej(`Passed in ${typeof ChannelLink} but a String would be required for the ChannelLink`);
                if (!Util.isValidURL(ChannelLink)) return rej(`${ChannelLink} is not a Valid URL (YT)`);
                let channel = await channelInfo(ChannelLink);
                if (!channel) return rej("NO INFORMATION FOUND")
                return res(channel);
            } catch (error) {
                return rej(error);
            }
        })
    }


    /** Get Videos of a LINK
     * @param {string} ChannelLink Youtube Channel Link, example: https://youtube.com/c/Tomato6966
     * returns: https://github.com/Tomato6966/discord-yt-poster/wiki/Response-getLatestVideos
     */
    async getLatestVideos(ChannelLink) {
        return new Promise(async (res, rej) => {
            try {
                if (!ChannelLink) return rej("A String is required for the ChannelLink");
                if (typeof ChannelLink !== "string") return rej(`Passed in ${typeof ChannelLink} but a String would be required for the ChannelLink`);
                if (!Util.isValidURL(ChannelLink)) return rej(`${ChannelLink} is not a Valid URL (YT)`);
                let channel = await channelInfo(ChannelLink);
                if (!channel) return rej("NO CHANNEL INFORMATION FOUND")
                let content = await parser.parseURL(`https://www.youtube.com/feeds/videos.xml?channel_id=${channel.id}`);
                content = content.items.map(v => {
                    var OBJ = {}
                    OBJ.title = v.title
                    OBJ.link = v.link
                    OBJ.pubDate = v.pubDate
                    OBJ.author = v.author
                    OBJ.id = v.link.split("watch?v=")[1] || v.id,
                        OBJ.isoDate = v.isoDate
                    return OBJ;
                })
                let tLastVideos = content.sort((a, b) => {
                    let aPubDate = new Date(a.pubDate || 0).getTime();
                    let bPubDate = new Date(b.pubDate || 0).getTime();
                    return bPubDate - aPubDate;
                });
                if (tLastVideos.length == 0) return rej("No Videos posted yet")
                return res(tLastVideos);
            } catch (error) {
                return rej(error);
            }
        })
    }


    /** Get YTChannel for LINK
     * @param {string} DiscordGuildID Discord Guild id
     * @param {string} ChannelLink Youtube Channel Link, example: https://youtube.com/c/Tomato6966
     * returns: https://github.com/Tomato6966/discord-yt-poster/wiki/Response-getChannel
     */
    async getChannel(DiscordGuildID, ChannelLink) {
        return new Promise(async (res, rej) => {
            try {
                if (!DiscordGuildID) return rej("A String is required for the DiscordGuildID");
                if (typeof DiscordGuildID !== "string" || DiscordGuildID.length != 18) return rej(`Passed in ${typeof DiscordGuildID} but a String would be required for the DiscordGuildID`);
                if (!ChannelLink) return rej("A String is required for the ChannelLink");
                if (typeof ChannelLink !== "string") return rej(`Passed in ${typeof ChannelLink} but a String would be required for the ChannelLink`);
                if (!Util.isValidURL(ChannelLink)) return rej(`${ChannelLink} is not a Valid URL (YT)`);
                await this.YTP_DB.ensure(DiscordGuildID, {
                    channels: []
                });
                await Util.delay(200);
                var Obj = {}
                let channels = await this.YTP_DB.get(`${DiscordGuildID}.channels`);
                let CHdata = channels.find(v => v.YTchannel.split("/")[v.YTchannel.split("/").length - 1] == ChannelLink.split("/")[ChannelLink.split("/").length - 1])
                if (!CHdata) {
                    CHdata = "Channel not setup yet";
                    return rej(CHdata);
                }
                return res(CHdata);
            } catch (error) {
                return rej(error);
            }
        })
    }


    /** Get YTChannels for User
     * @param {string} DiscordGuildID Discord Guild id
     * @param {OBJECT|DiscordUser} DiscordUser DiscordUser with ID parameter
     * returns: https://github.com/Tomato6966/discord-yt-poster/wiki/Response-getChannels4User
     */
    async getChannels4User(DiscordGuildID, DiscordUser) {
        return new Promise(async (res, rej) => {
            try {
                if (!DiscordGuildID) return rej("A String is required for the DiscordGuildID");
                if (typeof DiscordGuildID !== "string" || DiscordGuildID.length != 18) return rej(`Passed in ${typeof DiscordGuildID} but a String would be required for the DiscordGuildID`);
                if (!DiscordUser || !DiscordUser.id) return rej("No User with a Valid ID added for DiscordUser");
                await this.YTP_DB.ensure(DiscordGuildID, {
                    channels: []
                });
                await Util.delay(200);
                var Obj = {}
                let channels = await this.YTP_DB.get(`${DiscordGuildID}.channels`);
                let CHdata = channels.filter(v => v.DiscordUser == DiscordUser.id)
                if (!CHdata || CHdata.length == 0) {
                    CHdata = "User has no Channels";
                    return rej(CHdata);
                }
                return res(CHdata);
            } catch (error) {
                return rej(error);
            }
        })
    }


    /** Edit a specific YTChannel in a Guild ID
     * @param {string} ChannelLink Youtube Channel Link, example: https://youtube.com/c/Tomato6966
     * @param {OBJECT|DiscordChannel} DiscordChannel DiscordChannel with ID && guild parameters
     * @param {OBJECT|DiscordUser} DiscordUser DiscordUser with ID parameter. who owns the Link
     * @param {string} Notification Notification Message | OPTIONAL | DEFAULT: uses the options
     * returns: https://github.com/Tomato6966/discord-yt-poster/wiki/Response-editChannel
     */
    async editChannel(ChannelLink, DiscordChannel, DiscordUser, Notification = this.options.defaults.Notification) {
        return new Promise(async (res, rej) => {
            try {
                if (!ChannelLink) return rej("A String is required for the ChannelLink");
                if (typeof ChannelLink !== "string") return rej(`Passed in ${typeof ChannelLink} but a String would be required for the ChannelLink`);
                if (!Util.isValidURL(ChannelLink)) return rej(`${ChannelLink} is not a Valid URL (YT)`);
                if (!DiscordChannel || !DiscordChannel.guild || !DiscordChannel.id) return rej("A DiscordChannel with Guild Information is required!");
                await this.YTP_DB.ensure(DiscordChannel.guild.id, {
                    channels: []
                });
                await Util.delay(200);
                let channels = await this.YTP_DB.get(`${DiscordChannel.guild.id}.channels`);
                let CHdata = channels.find(v => v.YTchannel.split("/")[v.YTchannel.split("/").length - 1] == ChannelLink.split("/")[ChannelLink.split("/").length - 1])
                let index = channels.findIndex(v => v.YTchannel.split("/")[v.YTchannel.split("/").length - 1] == ChannelLink.split("/")[ChannelLink.split("/").length - 1])
                if (!CHdata) {
                    rej("Channel not setup yet")
                    return;
                }
                let newCHdata = {
                    YTchannel: ChannelLink,
                    DiscordGuild: DiscordChannel.guild.id,
                    DiscordChannel: DiscordChannel.id,
                    DiscordUser: DiscordUser ? DiscordUser.id : "",
                    oldvid: CHdata.oldvid,
                    alrsent: CHdata.alrsent,
                    message: Notification
                }
                //remove item from the channels array which we got
                channels[index] = newCHdata;
                //set the new channels
                await this.YTP_DB.set(`${DiscordChannel.guild.id}.channels`, channels);
                let data = await this.YTP_DB.get(`${DiscordChannel.guild.id}.channels`);
                var Obj = {};
                Obj = newCHdata;
                Obj.allChannels = data;
                Obj.beforeEditChannel = CHdata;
                return res(Obj);
            } catch (error) {
                return rej(error);
            }
        })
    }


    /** Delete a specific YTChannel in a Guild
     * @param {string} DiscordGuildID Discord Guild id
     * @param {string} ChannelLink Youtube Channel Link, example: https://youtube.com/c/Tomato6966
     * returns: https://github.com/Tomato6966/discord-yt-poster/wiki/Response-deleteChannel
     */
    async deleteChannel(DiscordGuildID, ChannelLink) {
        return new Promise(async (res, rej) => {
            try {
                if (!ChannelLink) return rej("A String is required for the ChannelLink");
                if (typeof ChannelLink !== "string") return rej(`Passed in ${typeof ChannelLink} but a String would be required for the ChannelLink`);
                if (!DiscordGuildID) return rej("A String is required for the DiscordGuildID");
                if (typeof DiscordGuildID !== "string" || DiscordGuildID.length != 18) return rej(`Passed in ${typeof DiscordGuildID} but a String would be required for the DiscordGuildID`);
                if (!Util.isValidURL(ChannelLink)) return rej(`${ChannelLink} is not a Valid URL (YT)`);
                await this.YTP_DB.ensure(DiscordGuildID, {
                    channels: []
                });
                await Util.delay(200);
                let channels = await this.YTP_DB.get(`${DiscordGuildID}.channels`);
                let CHdata = channels.find(v => v.YTchannel.split("/")[v.YTchannel.split("/").length - 1] == ChannelLink.split("/")[ChannelLink.split("/").length - 1])
                let index = channels.findIndex(v => v.YTchannel.split("/")[v.YTchannel.split("/").length - 1] == ChannelLink.split("/")[ChannelLink.split("/").length - 1])
                if (!CHdata) {
                    rej("Channel not setup yet")
                    return;
                }
                //remove item from the channels array which we got
                channels.splice(index, 1);
                //set the new channels
                await this.YTP_DB.set(`${DiscordGuildID}.channels`, channels);
                let data = await this.YTP_DB.get(`${DiscordGuildID}.channels`);
                var Obj = {};
                Obj.allChannels = data;
                Obj.deletedChannel = CHdata;
                return res(Obj);
            } catch (error) {
                return rej(error);
            }
        })
    }


    /** Gets all Channels of a Guild
     * @param {string} DiscordGuildID Discord Guild id
     * returns: https://github.com/Tomato6966/discord-yt-poster/wiki/Response-getAllChannels
     */
    async getAllChannels(DiscordGuildID) {
        return new Promise(async (res, rej) => {
            try {
                if (!DiscordGuildID) return rej("A String is required for the DiscordGuildID");
                if (typeof DiscordGuildID !== "string" || DiscordGuildID.length != 18) return rej(`Passed in ${typeof DiscordGuildID} but a String would be required for the DiscordGuildID`);
                await this.YTP_DB.ensure(DiscordGuildID, {
                    channels: []
                });
                await Util.delay(200);
                let channels = await this.YTP_DB.get(`${DiscordGuildID}.channels`);
                return res(channels);
            } catch (error) {
                return rej(error);
            }
        })
    }


    /** Delete all Channels in a GUild
     * @param {string} DiscordGuildID Discord Guild id
     * returns: https://github.com/Tomato6966/discord-yt-poster/wiki/Response-deleteAllChannels
     */
    async deleteAllChannels(DiscordGuildID) {
        return new Promise(async (res, rej) => {
            try {
                if (!DiscordGuildID) return rej("A String is required for the DiscordGuildID");
                if (typeof DiscordGuildID !== "string" || DiscordGuildID.length != 18) return rej(`Passed in ${typeof DiscordGuildID} but a String would be required for the DiscordGuildID`);
                let olddata = await this.YTP_DB.get(`${DiscordGuildID}.channels`);
                await this.YTP_DB.set(DiscordGuildID, {
                    channels: []
                });
                let data = await this.YTP_DB.get(`${DiscordGuildID}.channels`);
                const Obj = {};
                Obj.allChannels = data;
                Obj.deletedChannels = olddata;
                return res(Obj);
            } catch (error) {
                return rej(error);
            }
        })
    }
}
module.exports = YoutubePoster;
