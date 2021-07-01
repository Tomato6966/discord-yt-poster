<div align="center">
  <p>
    <img alt="npm" src="https://img.shields.io/npm/dt/memer-api">
  <a href="https://maintained.cc"><img src="https://maintained.cc/SDBagel/Maintained/1?" alt="Status Badge"></a>
  <a href="https://maintained.cc"><img src="https://maintained.cc/SDBagel/Maintained/2?" alt="Get Started Now"></a>
  <a href=""><img src="https://badges.frapsoft.com/os/v1/open-source.svg?v=103" alt="Open Source"></a>
  
  </p>
</div>


[![forthebadge](https://forthebadge.com/images/badges/built-with-love.svg)](https://forthebadge.com)
[![forthebadge](https://forthebadge.com/images/badges/made-with-javascript.svg)](https://forthebadge.com)


# Memer Api - Welcome

Memer API is a powerful module that allows you to manipulate images very easily.

## **Installation** 
```
npm install memer-api
```
```js
const Meme = require("memer-api");
const memer = new Meme();
memer.<Method>(<Options>); //returns -> Promise -> <Buffer>
```

**Join our [Discord Server](https://discord.gg/emD44ZJaSA) for Support**


**For more help view [Documentation ](https://memer-api.js.org)**


## **Features**

* **Super simple**
* **Easy to use** 
* **More than 40 methods.**
* **Beginner-friendly** 
* **Great Support**
* **Flexible**


## Examples

```js
const Meme = require("memer-api"), Discord = require("discord.js"), memer = new Meme();

const avatar = "https://imgur.com/I5DmdNR.png"; //only static images supported / works! no gifs / videos

memer.jail(avatar).then(jail=> {
    //now you have a "BUFFER", for Discord create an attachment
      //var attachment = new Discord.MessageAttachment(image, "bed.png");
      //<Channel>.send(attachment)
})
```


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
     Delete all YTChannels in a GUild
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
     Get all YTChannels in a GUild
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
     Get all YTChannels in a GUild
      * @param {string} DiscordGuildID Discord Guild id
    *********************************************************************************************************
    client.YTP.getAllChannels(DiscordGuildID)
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
