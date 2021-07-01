//Import the Module directly, as with an forc ;) as well as discord.js and create a new client for discord bot & memer Bot
const YoutubePoster = require("../index.js");
const Discord = require("discord.js");
const client = new Discord.Client();
//get the prefix
const prefix = require("./config.json").prefix;

//Read Event 
client.on("ready", () => {
    console.log(`${client.user.tag} is online and ready 2 be used!`.bold.brightGreen.bgCyan); // eslint-disable-line no-console
    //Set the Client.YTP after the Bot is online!
    client.YTP = new YoutubePoster(client);
});

//Log Message
client.on("message", async (message) => {
    //if in a dm or msg from a bot, return 
    if (!message.Guild || message.author.bot) return; 

    const args = message.content.slice(prefix.length).trim().split(" ");
    const cmd = args.shift().toLowerCase();

    if(cmd == "help"){
        
            let embed = new Discord.MessageEmbed()
                .setTitle("All Commands")
                .setURL("https://www.npmjs.com/package/discord-youtube-poster")
                .setColor("RED")
                .addField(`${prefix}set`, `> *Set a setup Channel with a CHANNELLINK, DCCHAT, DCUSER and a MESSAGE*`, true)
                .addField(`${prefix}edit`, `> *Edit a setup Channel with a CHANNELLINK, DCCHAT, DCUSER and a MESSAGEK*`, true)
                .addField(`${prefix}remove`, `> *Delete/Remove a setup Channel by a CHANNELLINK*`, true)
                .addField(`${prefix}get`, `> *Get a setup Channel by a CHANNELLINK*`, true)
                .addField(`${prefix}getuser`, `> *Get all setup Channels of a USER*`, true)
                .addField(`${prefix}getallchannels`, `> *Get all setup Channels of this Guild*`, true)
                .addField(`${prefix}deleteallchannels`, `> *Delete/Remove all setup Channels of this Guild*`, true)
                .addField(`${prefix}channelinfo`, `> *Get detailed YT-Channel-Data by a CHANNELLINK*`, true)
                .addField(`${prefix}latestvideos`, `> *Get all/latest Videos by a CHANNELLINK*`, true)
                .addField(`${prefix}lastvideo`, `> *Get the most recent uploaded Video by a CHANNELLINK*`, true)
                .setFooter(`npm i discord-youtube-poster\nDC-HELP: https://discord.gg/FQGXbypRf8`)
            message.channel.send({content: `**\`\`\`npm i discord-youtube-poster\`\`\`**\nDC-HELP: https://discord.gg/FQGXbypRf8\nhttps://www.npmjs.com/package/discord-youtube-poster`, embed: embed}).then(msg=>msg.react("👍"))
    }


    let toreplace_format =  
        `**\`{videourl}\` ==> URL / LINK**` + "\n" +
        `**\`{video}\` ==> URL / LINK**` + "\n" +
        `**\`{url}\` ==> URL / LINK**` + "\n" +
        `**\`{videotitle}\` ==> TITLE / NAME**` + "\n" +
        `**\`{name}\` ==> TITLE / NAME**` + "\n" +
        `**\`{title}\` ==> TITLE / NAME**` + "\n" +
        `**\`{videoauthorname}\` ==> Channelauthor NAME**` + "\n" +
        `**\`{authorname}\` ==> Channelauthor NAME**` + "\n" +
        `**\`{author}\` ==> Channelauthor NAME**` + "\n" +
        `**\`{creator}\` ==> Channelauthor NAME**` + "\n" +
        `**\`{creatorname}\` ==> Channelauthor NAME**` + "\n" +
        `**\`{discorduser}\` ==> ID of the LINKED USER**` + "\n" +
        `**\`{user}\` ==> ID of the LINKED USER**` + "\n" +
        `**\`{member}\` ==> ID of the LINKED USER**` + "\n\n" +
        `**__DEFAULT MESSAGE:__** \`\`\`${client.YTP.options.defaults.Notification}\`\`\``;


    if (cmd === "set" || cmd === "add" || cmd === "youtube") {
        let ChannelLink = args[0];
        let DiscordChannel = message.mentions.channels.filter(c => c.Guild.id == message.Guild.id).first() || message.Guild.channels.cache.get(args[1]);
        let DiscordUser = message.mentions.members.filter(m => m.Guild.id == message.Guild.id).first()?.user || message.Guild.members.cache.get(args[2])?.user;
        let Notification = args.slice(3).join(" ") || client.YTP.options.defaults.Notification;
        let preventDuplicates = true;
        if(!DiscordUser) {
            try{
                let mem = await message.Guild.members.fetch(args[2])
                if(mem) DiscordUser = mem.user;
            } catch{  }
        }
        if(!ChannelLink || !DiscordChannel || !DiscordUser) return message.reply(`:x: Usage: \`${prefix}set <LINK> <CHANNEL> <USER> [TEXT...]\`\n\n**Replacements:**\n` + toreplace_format)
        client.YTP.setChannel(ChannelLink, DiscordChannel, DiscordUser, Notification, preventDuplicates = true)
        .then(ch =>{
            //console.log(ch)
            message.reply(`I will now post Notifications for ${ch.YTchannel} (<@${ch.DiscordUser}>) in <#${ch.DiscordChannel}>\n\nThe Message:\n${ch.message}`).then(msg=>msg.react("👍"))
        }).catch(e=>{
            console.log(e);
            message.reply(`${e.message ? e.message : e}`, {code: "js"})
        })
    }

    if (cmd === "edit" || cmd === "change" || cmd === "adjust") {
        let ChannelLink = args[0];
        let DiscordChannel = message.mentions.channels.filter(c => c.Guild.id == message.Guild.id).first() || message.Guild.channels.cache.get(args[1]);
        let DiscordUser = message.mentions.members.filter(m => m.Guild.id == message.Guild.id).first()?.user || message.Guild.members.cache.get(args[2])?.user;
        let Notification = args.slice(3).join(" ") || client.YTP.options.defaults.Notification;
        if(!DiscordUser) {
            try{
                let mem = await message.Guild.members.fetch(args[2])
                if(mem) DiscordUser = mem.user;
            } catch{  }
        }
        if(!ChannelLink || !DiscordChannel || !DiscordUser) return message.reply(`:x: Usage: \`${prefix}edit <LINK> <CHANNEL> <USER> [TEXT...]\`\n\n**Replacements:**\n` + toreplace_format)
        client.YTP.editChannel(ChannelLink, DiscordChannel, DiscordUser, Notification)
        .then(ch =>{
            /*  {
                    YTchannel: 'https://youtube.com/c/Tomato6966',
                    DiscordGuild: '814525315367698442',
                    DiscordChannel: '859790431645466624',
                    DiscordUser: '442355791412854784',
                    oldvid: 'dKOLavT1pJ0',
                    alrsent: [ 'dKOLavT1pJ0' ],
                    message: '42069 {url}',

                    allChannels: [
                        {
                        YTchannel: 'https://youtube.com/c/Tomato6966',
                        DiscordGuild: '814525315367698442',
                        DiscordChannel: '859790431645466624',
                        DiscordUser: '442355791412854784',
                        oldvid: 'dKOLavT1pJ0',
                        alrsent: [Array],
                        message: '42069 {url}'
                        }
                    ],

                    beforeEditChannel: {
                        YTchannel: 'https://youtube.com/c/Tomato6966',
                        DiscordGuild: '814525315367698442',
                        DiscordChannel: '859790431645466624',
                        DiscordUser: '442355791412854784',
                        oldvid: 'dKOLavT1pJ0',
                        alrsent: [ 'dKOLavT1pJ0' ],
                        message: '{url}'
                    }
                }
            */ 
            //console.log(ch)
            message.reply(`I changed the Settings for ${ch.YTchannel} (<@${ch.DiscordUser}>), posting in <#${ch.DiscordChannel}>\n\nThe Message:\n${ch.message}`).then(msg=>msg.react("👍"))
        }).catch(e=>{
            console.log(e);
            message.reply(`${e.message ? e.message : e}`, {code: "js"})
        })
    }

    if (cmd === "remove" || cmd === "delete" || cmd == "del") {
        let ChannelLink = args[0];
        if(!ChannelLink) return message.reply(`:x: Usage: \`${prefix}del <LINK>`)
        client.YTP.deleteChannel(message.Guild.id, ChannelLink)
        .then(ch =>{
            //console.log(ch)
            message.reply(`I deleted the Settings for ${ch.YTchannel} (<@${ch.DiscordUser}>), posting in <#${ch.DiscordChannel}>\n\nThe Message:\n${ch.message}`).then(msg=>msg.react("👍"))
        }).catch(e=>{
            console.log(e);
            message.reply(`${e.message ? e.message : e}`, {code: "js"})
        })
    }

    if (cmd === "get" || cmd === "details" || cmd === "info") {
        let ChannelLink = args[0];
        if(!ChannelLink) return message.reply(`:x: Usage: \`${prefix}get <LINK>\``)
        client.YTP.getChannel(message.Guild.id, ChannelLink).then(ch => {
            //console.log(ch)
            message.channel.send(`**Guild:**\n> **\`${client.Guilds.cache.get(ch.DiscordGuild).name}\`**` + "\n" +
            `**Channel to Post:**\n> **${message.Guild.channels.cache.get(ch.DiscordChannel)}**` + "\n" +
            `**Channel Link:**\n> **${ch.YTchannel}**` + "\n" +
            `**Linked User:**\n> **\`${message.Guild.members.cache.get(ch.DiscordUser).user.tag}\`**` + "\n" +
            `**Last Video:**\n> **\`https://youtube.com/watch=?v${ch.oldvid}\`**` + "\n" +
            `**Message:**\n>>> \`\`\`${ch.message}\`\`\``).then(msg=>msg.react("👍"))
        }).catch(e=>{
            console.log(e);
            message.reply(`${e.message ? e.message : e}`, {code: "js"})
        })
    }

    if (cmd === "getuser" || cmd === "userdetails" || cmd === "userinfoinfo") {
        let user = message.mentions.users.first() || message.Guild.members.cache.get(args[0])?.user;
        if(!user) user = message.author;
        client.YTP.getChannels4User(message.Guild.id, user).then(chs => {
            //Array of ChannelData information
            message.channel.send(`**__All Links__**\n\`\`\`${chs.map(ch=>ch.YTchannel).join("\n")}\`\`\``).then(msg=>msg.react("👍"))
        }).catch(e=>{
            console.log(e);
            message.reply(`${e.message ? e.message : e}`, {code: "js"})
        })
    }

    if (cmd === "getallchannels") {
        client.YTP.getAllChannels(message.Guild.id)
        .then(channels =>{
            //console.log(ch)
            message.reply(`There are ${channels.length} Channels Setupped!`).then(msg=>msg.react("👍"))
        }).catch(e=>{
            console.log(e);
            message.reply(`${e.message ? e.message : e}`, {code: "js"})
        })
    }

    if (cmd === "deleteallchannels") {
        client.YTP.deleteAllChannels(message.Guild.id)
        .then(data =>{
            //console.log(ch)
            message.reply(`I deleted ${data.deletedChannels.length} Channels`).then(msg=>msg.react("👍"))
        }).catch(e=>{
            console.log(e);
            message.reply(`${e.message ? e.message : e}`, {code: "js"})
        })
    }

    if (cmd === "channelinfo") {
        let ChannelLink = args[0];
        if(!ChannelLink) return message.reply(`:x: Usage: \`${prefix}channelinfo <LINK>\``)
        client.YTP.getChannelInfo(ChannelLink).then(Channel => {
            //console.log(Channel)
            message.channel.send(new Discord.MessageEmbed()
            .setTitle(Channel.name)
            .setURL(Channel.url)
            .setColor("RED")
            .addField("**Subscribercount:**", "`" + Channel.subscribers + "`")
            .addField("**Tags:**", Channel.tags.map(t=>`\`${t}\``).join(",  "))
            .addField("**Unlisted:**", Channel.unlisted ? "✅" : "❌", true)
            .addField("**FamilySafe:**", Channel.familySafe ? "✅" : "❌", true)
            .setFooter("ID: " + Channel.id)
            .setImage(Channel.mobileBanner[0]?.url)
            .setDescription(String(Channel.description).substr(0, 1500))
            ).then(msg=>msg.react("👍"))
        }).catch(e=>{
            console.log(e);
            message.reply(`${e.message ? e.message : e}`, {code: "js"})
        })
    }

    if (cmd === "latestvideos" || cmd == "allvideos") {
        let ChannelLink = args[0];
        if(!ChannelLink) return message.reply(`:x: Usage: \`${prefix}latestVideos <LINK>\``)
        client.YTP.getLatestVideos(ChannelLink).then(Videos => {
            console.log(Videos)
            let embed = new Discord.MessageEmbed()
                .setTitle(`Videos of ${Videos[0].author}`)
                .setColor("RED")
                .setURL(ChannelLink)
            Videos.forEach((v, i) => {
                if(i < 10){
                    embed.addField(v.title, `[Watch it](${v.link}) | Published at: \`${v.pubDate}\``)
                } 
            })
            message.channel.send({embed: embed}).then(msg=>msg.react("👍"))
        }).catch(e=>{
            console.log(e);
            message.reply(`${e.message ? e.message : e}`, {code: "js"})
        })
    }

    if (cmd === "lastvideo") {
        let ChannelLink = args[0];
        if(!ChannelLink) return message.reply(`:x: Usage: \`${prefix}lastVideo <LINK>\``)
        client.YTP.getLatestVideos(ChannelLink).then(videos => {
            let video = videos[0]
            let time = new Date(video.pubDate)
        
            let embed = new Discord.MessageEmbed()
            .setTitle(video.title)
            .setURL(video.link)
            .setColor("RED")
            .setFooter(`ID: ${video.id}`)
            .setTimestamp(time.getTime())
            message.channel.send({content: `${video.link}`, embed: embed}).then(msg=>msg.react("👍"))
        }).catch(e=>{
            console.log(e);
            message.reply(`${e.message ? e.message : e}`, {code: "js"})
        })
    }
});

//login to the Discord Bot
client.login(require("./config.json").token)


/******************************************************************* /
/                                                                    /
/                   RESULTS OF THE PROMISES:                         /       
/                                                                    /
/ *******************************************************************/


//YTP.setChannel()
/** *********************************************************************************************************
     Set a new YTChannel to a Guild ID
      * @param {string} ChannelLink Youtube Channel Link, example: https://youtube.com/c/Tomato6966
      * @param {string} DiscordGuildID Discord Guild id
      * @param {string} DiscordChannel Discord Channel id
      * @param {string} DiscordUser Discord User id, who owns the Link
      * @param {string} Notification Notification Message | OPTIONAL | DEFAULT: uses the options
      * @param {Boolean} preventDuplicates Default: True
    *********************************************************************************************************
    client.YTP.setChannel(ChannelLink, DiscordChannel, DiscordUser, Notification, preventDuplicates = true)
    //Returns { PROMISE }, EXAMPLE DATA:
        {
            YTchannel: 'https://youtube.com/c/Tomato6966',
            DiscordGuild: '814525315367698442',
            DiscordChannel: '859790431645466624',
            DiscordUser: '442355791412854784',
            oldvid: 'dKOLavT1pJ0',
            alrsent: [ 'dKOLavT1pJ0' ],
            message: '{url}'
        }
*/


//YTP.editChannel()
/** *********************************************************************************************************
    Edit a specific YTChannel in a Guild ID
      * @param {string} ChannelLink Youtube Channel Link, example: https://youtube.com/c/Tomato6966
      * @param {string} DiscordGuildID Discord Guild id
      * @param {string} DiscordChannel Discord Channel id
      * @param {string} DiscordUser Discord User id, who owns the Link
      * @param {string} Notification Notification Message | OPTIONAL | DEFAULT: uses the options
    *********************************************************************************************************
    client.YTP.editChannel(ChannelLink, DiscordChannel, DiscordUser, Notification, preventDuplicates = true)
    //Returns { PROMISE }, EXAMPLE DATA:
        {
            YTchannel: 'https://youtube.com/c/Tomato6966',
            DiscordGuild: '814525315367698442',
            DiscordChannel: '859790431645466624',
            DiscordUser: '442355791412854784',
            oldvid: 'dKOLavT1pJ0',
            alrsent: [ 'dKOLavT1pJ0' ],
            message: '42069 {url}',

            allChannels: [
                {
                YTchannel: 'https://youtube.com/c/Tomato6966',
                DiscordGuild: '814525315367698442',
                DiscordChannel: '859790431645466624',
                DiscordUser: '442355791412854784',
                oldvid: 'dKOLavT1pJ0',
                alrsent: [Array],
                message: '42069 {url}'
                }
            ],

            beforeEditChannel: {
                YTchannel: 'https://youtube.com/c/Tomato6966',
                DiscordGuild: '814525315367698442',
                DiscordChannel: '859790431645466624',
                DiscordUser: '442355791412854784',
                oldvid: 'dKOLavT1pJ0',
                alrsent: [ 'dKOLavT1pJ0' ],
                message: '{url}'
            }
        }
*/


//YTP.delChannel()
/** *********************************************************************************************************   
     Delete a specific YTChannel in a Guild
      * @param {string} DiscordGuildID Discord Guild id
      * @param {string} ChannelLink Youtube Channel Link, example: https://youtube.com/c/Tomato6966
    **********************************************************************************************************
    client.YTP.delChannel(DiscordGuildID, ChannelLink)
    //Returns { PROMISE }, DATA:
        {
            allChannels: [],
            deletedChannel: {
                YTchannel: 'https://youtube.com/c/Tomato6966',
                DiscordGuild: '814525315367698442',
                DiscordChannel: '859790431645466624',
                DiscordUser: '442355791412854784',
                oldvid: '',
                alrsent: [],
                message: '42069 {url}'
            }
        }

*/

//YTP.getChannel()
/** *********************************************************************************************************
     Get a Specific Channel in a Guild
      * @param {string} DiscordGuildID Discord Guild id
      * @param {string} ChannelLink Youtube Channel Link, example: https://youtube.com/c/Tomato6966
    *********************************************************************************************************
    client.YTP.getChannel(DiscordGuildID, ChannelLink)
    //Returns { PROMISE }, EXAMPLE DATA:
        {
            YTchannel: 'https://youtube.com/c/Tomato6966',
            DiscordGuild: '814525315367698442',
            DiscordChannel: '859790431645466624',
            DiscordUser: '442355791412854784',
            oldvid: 'dKOLavT1pJ0',
            alrsent: [ 'dKOLavT1pJ0' ],
            message: '{url}'
        }
*/


//YTP.getAllChannels()
/** *********************************************************************************************************
     Get all YTChannels in a Guild
      * @param {string} DiscordGuildID Discord Guild id
    *********************************************************************************************************
    client.YTP.getAllChannels(DiscordGuildID)
    //Returns { PROMISE }, EXAMPLE DATA:
        [
            {
                YTchannel: 'https://youtube.com/c/Tomato6966',
                DiscordGuild: '814525315367698442',
                DiscordChannel: '859790431645466624',
                DiscordUser: '442355791412854784',
                oldvid: 'dKOLavT1pJ0',
                alrsent: [ 'dKOLavT1pJ0' ],
                message: '{url}'
            }
        ]
*/

//YTP.deleteAllChannels()
/** *********************************************************************************************************
     Deletes all YTChannels in a Guild
      * @param {string} DiscordGuildID Discord Guild id
    *********************************************************************************************************
    client.YTP.deleteAllChannels(DiscordGuildID)
    //Returns { PROMISE }, EXAMPLE DATA:
        [
            allChannels: [],
            deletedChannels: [
                {
                    YTchannel: 'https://youtube.com/c/Tomato6966',
                    DiscordGuild: '814525315367698442',
                    DiscordChannel: '859790431645466624',
                    DiscordUser: '442355791412854784',
                    oldvid: 'dKOLavT1pJ0',
                    alrsent: [ 'dKOLavT1pJ0' ],
                    message: '{url}'
                }
            ]
        ]
*/


//YTP.getChannelInfo()
/** *********************************************************************************************************
     Get a Yt Channel Information
      * @param {string} ChannelLink Youtube Channel Link, example: https://youtube.com/c/Tomato6966
    *********************************************************************************************************
    client.YTP.getChannelInfo(ChannelLink)
    //Returns { PROMISE }, EXAMPLE DATA:
        {
            name: 'Tomato6966',
            id: 'UC1AgotpFHNhzolUtAjPgZqQ',
            url: 'https://www.youtube.com/channel/UC1AgotpFHNhzolUtAjPgZqQ',
            rssUrl: 'https://www.youtube.com/feeds/videos.xml?channel_id=UC1AgotpFHNhzolUtAjPgZqQ',
            description: '►My Bot:  https://clan.milrato.eu 👍\n' +
                '►2021 Best Music Bot:   https://lava.milrato.eu 🤟\n' +
                '►Join my Discord Server: https://support.milrato.eu ❤️\n' +
                '►Github: https://github.com/Tomato6966 📯\n' +
                '\n' +
                'Get Free Discord Bots: https://shop.milrato.eu\n' +
                '◼️➖◼️➖◼️➖◼️➖◼️➖◼️➖◼️➖◼️➖◼️➖◼️➖◼️\n',
            subscribers: '1410 Abonnenten',
            banner: [ARRAY OF OBJECTS WITH: .url, .widht, .height],
            tvBanner: [ARRAY OF OBJECTS WITH: .url, .widht, .height],
            mobileBanner: [ARRAY OF OBJECTS WITH: .url, .widht, .height],
            tags: [
                'Discord',   'Computer',
                'Fortnite',   'Tutorials'
            ],
            videos: [ 'USE THE FUNCTION: YTP.getLatestVideos(youtubeChannel)' ],
            unlisted: false,
            familySafe: true
        }
*/



//YTP.getLatestVideos()
/** *********************************************************************************************************
      Get all Vidoes of a Channel Sorted for the Latest Videos
      * @param {string} ChannelLink Youtube Channel Link, example: https://youtube.com/c/Tomato6966
    *********************************************************************************************************
    client.YTP.getLatestVideos(ChannelLink)
    //Returns { PROMISE }, EXAMPLE DATA:
        [
            {
                title: 'You ever needed Free/Cheap Discord Bots? 🤖 | 24/7 Hosting |',
                link: 'https://www.youtube.com/watch?v=7rSsJKqKYZg',
                pubDate: '2021-06-29T18:36:35.000Z',
                author: 'Tomato6966',
                id: '7rSsJKqKYZg',
                isoDate: '2021-06-29T18:36:35.000Z'
            },
            {
                title: 'How to read and use the discord.js Documentation | Javascript Basics | 2021',
                link: 'https://www.youtube.com/watch?v=WA-v_S54_9s',
                pubDate: '2021-06-22T19:30:46.000Z',
                author: 'Tomato6966',
                id: 'WA-v_S54_9s',
                isoDate: '2021-06-22T19:30:46.000Z'
            },
            {
                title: 'Discord Bot | How to make your Bot React faster | From 1sec Delay to 0 | In a Nutshell | discord.js',
                link: 'https://www.youtube.com/watch?v=tiwgiYWVjtI',
                pubDate: '2021-06-12T13:06:32.000Z',
                author: 'Tomato6966',
                id: 'tiwgiYWVjtI',
                isoDate: '2021-06-12T13:06:32.000Z'
            },
            {
                title: 'CANVAS TUTORIAL | How to make IMAGES with your BOT | Welcome Image, Rank Image, AND MORE! | d.js v12',
                link: 'https://www.youtube.com/watch?v=bRL1Jxa777k',
                pubDate: '2021-06-04T09:01:40.000Z',
                author: 'Tomato6966',
                id: 'bRL1Jxa777k',
                isoDate: '2021-06-04T09:01:40.000Z'
            },
            {
                title: 'How to add Buttons to your Bot Message | Paginated Embeds |Page Swap | EASY TUTORIAL | discord.js',
                link: 'https://www.youtube.com/watch?v=QWWbcNEiu7w',
                pubDate: '2021-05-27T20:15:43.000Z',
                author: 'Tomato6966',
                id: 'QWWbcNEiu7w',
                isoDate: '2021-05-27T20:15:43.000Z'
            },
        ]
*/
