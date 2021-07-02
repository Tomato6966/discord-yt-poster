/*
    MIT License

    Copyright (c) 2021 Tomato6966 (chris.pre03@gmail.com)

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in all
    copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
    SOFTWARE.
*/

//Import the Utils
const Discord = require("discord.js");
const Josh = require("@joshdb/core");
const Parser = require("rss-parser");
const parser = new Parser();
const colors = require("colors")
const YoutubeLogger = require('./youtubelogger.js');
const Util = require('./Util.js');
const CI = require('./channelInfo.js')
const JoshJSON = require('@joshdb/json'); //default Provider but there are also many other things like mongodb sqlite and more!
//swap the provider: https://josh.evie.dev/providers/about

//MAKE SURE TO INSTALL THE GIVEN PROVIDER TOO!, @joshdb/json @joshdb/mongo are already installed but sqlite etc. not, this is to support REPLIT etc.
class YoutubePoster {
    /**
     * @param {DiscordBotClient} client A Discord Bot Client, make sure it's ready otherwise you might face some sort of bugs
     * @param {OBJECT} options Options for the YoutubePoster
     * EXAMPLE OPTIONS:
     * {
            loop_delays_in_min: 6, //send a new video every 6 minutes, you can do 1 to be fast, but the more channels to check the more slower your bot will get + If you do tooo much youtube Requesting, then you might get IP BANNED (this is not tested/proven)
            defaults: {
                Notification: "<@{discorduser}> Posted: **{videotitle}**, as \`{videoauthorname}\`\n{videourl}"
            },
            provider: require('@joshdb/mongo'), //change this so its using your own providor!
            providerOptions: {
                url: 'mongodb://localhost',      //This is required for the MONGODB to tell him where the db is and PW. etc.
                collection: "Youtube - Poster"   //This is required for the MONGODB as a COLLECTION NAME (db name)
            },
        }
     */
    constructor(client, options) {
        //get the log string
        this.ytp_log = ` >-Discord-YT-Poster-< `.dim.red;
        this.warn_log = `[WARN] `.yellow;
        this.info_log = `[INFO] `.cyan;
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
            //provider: require('@joshdb/mongo'), //change this so its using your own providor!
            /*
            providerOptions: {
                url: 'mongodb://localhost',      //This is required for the MONGODB to tell him where the db is and PW. etc.
                collection: "Youtube - Poster"   //This is required for the MONGODB as a COLLECTION NAME (db name)
            },
            */
        }
        //set the global memer variable for the version
        this.version = require("../package.json").version;
        //set the author variable for the creators
        this.author = "Tomato6966";
        //set the author discord Support Server
        this.discord = "https://discord.gg/FQGXbypRf8";
        //set the author variable for the creators
        this.github = "https://github.com/Tomato6966/discord-yt-poster/wiki";
        //loop through the custom object
        this.checkOptions(options);
        //if no method added, use this, throw error
        if (!this.constructor && !this.constructor.name) {
            throw new Error(`The ${this.constructor.name} class may not be instantiated!`);
        }
        //Create the Provider
        this.createProvider();
        //if no db found throw error
        if (!this.YTP_DB) {
            throw new Error(`Failed creating the Database`);
        }
        //create the logger
        YoutubeLogger(this)
    }

    checkOptions(options) {
        if (options) {
            if(options.loop_delays_in_min || options.loop_delays_in_min == 0){
                if(typeof options.loop_delays_in_min != "number") throw new SyntaxError(`${`options.loop_delays_in_min`.bold}must be a NUMBER, you provided: ${`${typeof options.loop_delays_in_min}`.bold}`)
                let dela = Number(options.loop_delays_in_min)
                if(dela < 0) throw new SyntaxError(`${`options.loop_delays_in_min`.bold} must be ${`BIGGER or EQUAL then 0`.bold}, you provided: ${`${options.loop_delays_in_min}`.bold}`)
                if(dela > 59) throw new SyntaxError(`${`options.loop_delays_in_min`.bold} must be ${`SMALLER then 0`.bold}, you provided: ${`${options.loop_delays_in_min}`.bold}`)
                //set the new loop delay
                this.options.loop_delays_in_min = dela;
                console.log(this.ytp_log + this.info_log + `Using custom ${`options.loop_delays_in_min`.bold}: ${this.options.loop_delays_in_min} ${this.options.loop_delays_in_min == 0 ?  "\n" + this.ytp_log + this.info_log + "Tho it's 0, it will only check every 15 Seconds, otherwise you would spam to MUCH!".dim.yellow  : ""}`.dim.green);
            }
            if(options.defaults){
                if(options.defaults.Notification){
                    this.defaults.Notification = options.defaults.Notification;
                    console.log(this.ytp_log + this.info_log + `Using custom ${`options.defaults#Notification`.bold}: ${this.defaults.Notification}`.dim.green);
                }
            }
            if(options.provider){
                this.options.provider = options.provider
                console.log(this.ytp_log + this.info_log + `Using custom ${`options.provider`.bold}`.dim.green);
            }
            if(options.providerOptions){
                this.options.providerOptions = options.providerOptions
                if(!this.options.providerOptions.collection){
                    this.options.providerOptions.collection = "YoutubePoster";
                    console.log(this.ytp_log + this.warn_log + `No ${`options.provideroptions.collection`.bold} as a COLLECTION-NAME added`.dim.green);
                    console.log(this.ytp_log + this.warn_log + `Using default: "YoutubePoster"`.dim.green);
                }
                console.log(this.ytp_log + this.info_log + `Using custom ${`options.providerOptions`.bold}`.dim.green);
            }
            return this;
        } else {
            return this;
        }
    }

    createProvider() {
        if (this.options) {
            if (!this.options.providerOptions && typeof this.options.providerOptions !== "object") {
                console.log(this.ytp_log + this.info_log + "No Provider Options granted here is an Example for MongoDB: { providerOptions: { url: 'mongodb://localhost', collection: 'YoutubePoster' } }, if you use JoshJSON, then give it an EMPTY OBJECT".dim.yellow)
                return createDefaultProvider()
            } else {
                //use custom Options
                try {
                    let provider = String(this.options.provider)
                    let found = false;
                    if(!found && provider.toLowerCase().includes("mongo")) {
                        provider = "MongoDB";
                        found = true;
                    }
                    if(!found && provider.toLowerCase().includes("json")) {
                        provider = "JSON";
                        found = true;
                    }
                    if(!found && provider.toLowerCase().includes("sqlite")) {
                        provider = "SQLite";
                        found = true;
                    }
                    if(!found && provider.toLowerCase().includes("indexeddb")) {
                        provider = "IndexedDB";
                        found = true;
                    }
                    console.log(this.ytp_log + this.info_log + `Connecting to the CUSTOM ${found ? `${provider} `.bold : ""}Database Option... Please wait...`.dim.yellow);
                    this.YTP_DB = new Josh({
                        name: 'Discord-YoutubePoster',
                        provider: this.options.provider,
                        providerOptions: this.options.providerOptions
                    });
                    this.YTP_DB.defer.then(async () => {
                        let size;
                        try{ size = await this.YTP_DB.size}catch{}
                        try{ if(!size) size = this.YTP_DB.count}catch{}
                        try{ if(!size) size = await this.YTP_DB.length}catch{}
                        console.log(this.ytp_log + this.info_log + ` > Connected to the ${`custom`.underline} Database ${size ? `| There are: ${size} Rows/Entries ` : ""}< `.dim.bgGreen.brightWhite);
                    });
                } catch (error) {
                    this.YTP_DB = false;
                    throw error
                }
            }

        } else {
            console.log(this.ytp_log + this.info_log + `No ${"CUSTOM".bold} Database Options added, using JSON.`.italic.yellow);
            return createDefaultProvider()
        };
    }

    createDefaultProvider() {
        try{
            this.YTP_DB = new Josh({
                name: 'Discord-YoutubePoster',
                provider: JoshJSON,
                providerOptions: {},
            });
            this.YTP_DB.defer.then(async () => {
                console.log(this.ytp_log + this.info_log + `Connected the JSON-Database. There are: ${await this.YTP_DB.size} Rows/Entries`.dim.green);
                return this;
            });
        } catch (error) {
            this.YTP_DB = false;
            throw error
        }
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
                let channel = await CI.channelInfo(ChannelLink);
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
                let channel = await CI.channelInfo(ChannelLink);
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
