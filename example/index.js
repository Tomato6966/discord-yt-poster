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
    if (!message.guild || message.author.bot) return; 

    const args = message.content.slice(prefix.length).trim().split(" ");
    const cmd = args.shift().toLowerCase();

    if(cmd == "help"){
        //define help Embed
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
            //Send the Information Message
    message.channel.send({content: `**\`\`\`npm i discord-youtube-poster\`\`\`**\nDC-HELP: https://discord.gg/FQGXbypRf8\nhttps://www.npmjs.com/package/discord-youtube-poster\n\n**DOCS:**\nhttps://github.com/Tomato6966/discord-yt-poster/wiki/`, embed: embed}).then(msg=>msg.react("👍"))
    }

    //All possible replacement formats, see them: https://github.com/Tomato6966/discord-yt-poster/wiki/Replacement Formats
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
        if(!message.member.hasPermission("ADMINISTRATOR")) return message.reply(":x: Not allowed!")
        let ChannelLink = args[0];
        let DiscordChannel = message.mentions.channels.filter(c => c.guild.id == message.guild.id).first() || message.guild.channels.cache.get(args[1]);
        let DiscordUser = message.mentions.members.filter(m => m.guild.id == message.guild.id).first()?.user || message.guild.members.cache.get(args[2])?.user;
        let Notification = args.slice(3).join(" ") || client.YTP.options.defaults.Notification;
        let preventDuplicates = true;
        if(!ChannelLink || !DiscordChannel || !DiscordUser) return message.reply(`:x: Usage: \`${prefix}set <LINK> <CHANNEL> <USER> [TEXT...]\`\n\n**Replacements:**\n` + toreplace_format)
        //set a Channel
        client.YTP.setChannel(ChannelLink, DiscordChannel, DiscordUser, Notification, preventDuplicates = true)
        .then(ch =>{
            //console.log(ch) See the Responses: https://github.com/Tomato6966/discord-yt-poster/wiki/Responses
            //send the information
            message.reply(`I will now post Notifications for ${ch.YTchannel} (<@${ch.DiscordUser}>) in <#${ch.DiscordChannel}>\n\nThe Message:\n${ch.message}`).then(msg=>msg.react("👍"))
        }).catch(e=>{
            console.log(e);
            message.reply(`${e.message ? e.message : e}`, {code: "js"})
        })
    }

    if (cmd === "edit" || cmd === "change" || cmd === "adjust") {
        if(!message.member.hasPermission("ADMINISTRATOR")) return message.reply(":x: Not allowed!")
        let ChannelLink = args[0];
        let DiscordChannel = message.mentions.channels.filter(c => c.guild.id == message.guild.id).first() || message.guild.channels.cache.get(args[1]);
        let DiscordUser = message.mentions.members.filter(m => m.guild.id == message.guild.id).first()?.user || message.guild.members.cache.get(args[2])?.user;
        let Notification = args.slice(3).join(" ") || client.YTP.options.defaults.Notification;
        if(!ChannelLink || !DiscordChannel || !DiscordUser) return message.reply(`:x: Usage: \`${prefix}edit <LINK> <CHANNEL> <USER> [TEXT...]\`\n\n**Replacements:**\n` + toreplace_format)
        //Edit a Channel
        client.YTP.editChannel(ChannelLink, DiscordChannel, DiscordUser, Notification)
        .then(ch =>{
            //console.log(ch) See the Responses: https://github.com/Tomato6966/discord-yt-poster/wiki/Responses
            //send information message
            message.reply(`I changed the Settings for ${ch.YTchannel} (<@${ch.DiscordUser}>), posting in <#${ch.DiscordChannel}>\n\nThe Message:\n${ch.message}`).then(msg=>msg.react("👍"))
        }).catch(e=>{
            console.log(e);
            message.reply(`${e.message ? e.message : e}`, {code: "js"})
        })
    }

    if (cmd === "remove" || cmd === "delete" || cmd == "del") {
        if(!message.member.hasPermission("ADMINISTRATOR")) return message.reply(":x: Not allowed!")
        let ChannelLink = args[0];
        if(!ChannelLink) return message.reply(`:x: Usage: \`${prefix}del <LINK>`)
        //Delete a Channel
        client.YTP.deleteChannel(message.guild.id, ChannelLink)
        .then(ch =>{
            //console.log(ch) See the Responses: https://github.com/Tomato6966/discord-yt-poster/wiki/Responses
            //send information message
            message.reply(`I deleted the Settings for ${ch.YTchannel} (<@${ch.DiscordUser}>), posting in <#${ch.DiscordChannel}>\n\nThe Message:\n${ch.message}`).then(msg=>msg.react("👍"))
        }).catch(e=>{
            console.log(e);
            message.reply(`${e.message ? e.message : e}`, {code: "js"})
        })
    }

    if (cmd === "get" || cmd === "details" || cmd === "info") {
        let ChannelLink = args[0];
        if(!ChannelLink) return message.reply(`:x: Usage: \`${prefix}get <LINK>\``)
        //get a Channel
        client.YTP.getChannel(message.guild.id, ChannelLink).then(ch => {
            //console.log(ch) See the Responses: https://github.com/Tomato6966/discord-yt-poster/wiki/Responses
            //send the Information Message
            message.channel.send(`**Guild:**\n> **\`${client.guilds.cache.get(ch.DiscordGuild).name}\`**` + "\n" +
            `**Channel to Post:**\n> **${message.guild.channels.cache.get(ch.DiscordChannel)}**` + "\n" +
            `**Channel Link:**\n> **${ch.YTchannel}**` + "\n" +
            `**Linked User:**\n> **\`${message.guild.members.cache.get(ch.DiscordUser).user.tag}\`**` + "\n" +
            `**Last Video:**\n> **\`https://youtube.com/watch=?v${ch.oldvid}\`**` + "\n" +
            `**Message:**\n>>> \`\`\`${ch.message}\`\`\``).then(msg=>msg.react("👍"))
        }).catch(e=>{
            console.log(e);
            message.reply(`${e.message ? e.message : e}`, {code: "js"})
        })
    }

    if (cmd === "getuser" || cmd === "userdetails" || cmd === "userinfoinfo") {
        let user = message.mentions.users.first() || message.guild.members.cache.get(args[0])?.user;
        if(!user) user = message.author;
        //get all channels for a User, instead of using a Link
        client.YTP.getChannels4User(message.guild.id, user).then(chs => {
            //console.log(ch) See the Responses: https://github.com/Tomato6966/discord-yt-poster/wiki/Responses
            //send information, you could do a chs.map(ch=>ch.YTchannel)...
            message.channel.send(`**__All Links__**\n\`\`\`${chs.map(ch=>ch.YTchannel).join("\n")}\`\`\``).then(msg=>msg.react("👍"))
        }).catch(e=>{
            console.log(e);
            message.reply(`${e.message ? e.message : e}`, {code: "js"})
        })
    }

    if (cmd === "getallchannels") {
        //get all channels
        client.YTP.getAllChannels(message.guild.id)
        .then(chs =>{
            //console.log(ch) See the Responses: https://github.com/Tomato6966/discord-yt-poster/wiki/Responses
            //send information, you could do a chs.map(ch=>ch.YTchannel)...
            message.reply(`There are ${chs.length} Channels Setupped!`).then(msg=>msg.react("👍"))
        }).catch(e=>{
            console.log(e);
            message.reply(`${e.message ? e.message : e}`, {code: "js"})
        })
    }

    if (cmd === "deleteallchannels") {
        if(!message.member.hasPermission("ADMINISTRATOR")) return message.reply(":x: Not allowed!")
        //delete all channels method
        client.YTP.deleteAllChannels(message.guild.id)
        .then(data =>{
            //console.log(ch) See the Responses: https://github.com/Tomato6966/discord-yt-poster/wiki/Responses
            //send a successmessage
            message.reply(`I deleted ${data.deletedChannels.length} Channels`).then(msg=>msg.react("👍"))
        }).catch(e=>{
            console.log(e);
            message.reply(`${e.message ? e.message : e}`, {code: "js"})
        })
    }


    //NOT FOR THE PACKAGE, BUT CAN BE USED, like just INFORMATION FROM A YT LINK
    if (cmd === "channelinfo") {
        let ChannelLink = args[0];
        if(!ChannelLink) return message.reply(`:x: Usage: \`${prefix}channelinfo <LINK>\``)
        //get Channel Information
        client.YTP.getChannelInfo(ChannelLink).then(Channel => {
            //console.log(Channel) See the Responses: https://github.com/Tomato6966/discord-yt-poster/wiki/Responses
            //Define the Embed
            let embed = new Discord.MessageEmbed()
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
                //Send the Message
            message.channel.send({embed: embed}).then(msg=>msg.react("👍"))
        }).catch(e=>{
            console.log(e);
            message.reply(`${e.message ? e.message : e}`, {code: "js"})
        })
    }

    //NOT FOR THE PACKAGE, BUT CAN BE USED, like just INFORMATION FROM A YT LINK
    if (cmd === "latestvideos" || cmd == "allvideos") {
        let ChannelLink = args[0];
        if(!ChannelLink) return message.reply(`:x: Usage: \`${prefix}latestVideos <LINK>\``)
        //get the Latest Videos
        client.YTP.getLatestVideos(ChannelLink).then(Videos => {
            //console.log(Videos) See the Responses: https://github.com/Tomato6966/discord-yt-poster/wiki/Responses
            //define the Embed
            let embed = new Discord.MessageEmbed()
                .setTitle(`Videos of ${Videos[0].author}`)
                .setColor("RED")
                .setURL(ChannelLink)
            //For Each Video, add a new Field (just the first 10 Videos!)
            Videos.forEach((v, i) => {
                if(i < 10){
                    embed.addField(v.title, `[Watch it](${v.link}) | Published at: \`${v.pubDate}\``)
                } 
            })
            //Send the Message
            message.channel.send({embed: embed}).then(msg=>msg.react("👍"))
        }).catch(e=>{
            console.log(e);
            message.reply(`${e.message ? e.message : e}`, {code: "js"})
        })
    }

    //NOT FOR THE PACKAGE, BUT CAN BE USED, like just INFORMATION FROM A YT LINK
    if (cmd === "lastvideo") {
        let ChannelLink = args[0];
        if(!ChannelLink) return message.reply(`:x: Usage: \`${prefix}lastVideo <LINK>\``)
        //get the latest videos
        client.YTP.getLatestVideos(ChannelLink).then(videos => {
            let video = videos[0]
            let time = new Date(video.pubDate)
            //define the embed
            let embed = new Discord.MessageEmbed()
                .setTitle(video.title)
                .setURL(video.link)
                .setColor("RED")
                .setFooter(`ID: ${video.id}`)
                .setTimestamp(time.getTime())
            //Send the Message
            message.channel.send({content: `${video.link}`, embed: embed}).then(msg=>msg.react("👍"))
        }).catch(e=>{
            console.log(e);
            message.reply(`${e.message ? e.message : e}`, {code: "js"})
        })
    }
});

//login to the Discord Bot
client.login(require("./config.json").token)