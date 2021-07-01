<div align="center">
  <p> 
    <a href="https://discord.gg/FQGXbypRf8" title="Join our Discord Server"><img alt="Built with Love" src="https://forthebadge.com/images/badges/built-with-love.svg"></a>
    <a href="https://discord.gg/FQGXbypRf8" title="Join our Discord Server"><img alt="Made with Javascript" src="https://forthebadge.com/images/badges/made-with-javascript.svg"></a>
  </p>
  <p>
    <a href="https://discord.gg/FQGXbypRf8"><img src="https://discord.com/api/guilds/773668217163218944/embed.png" alt="Discord server"/></a>
    <a href="https://www.npmjs.com/package/discord-yt-poster"><img src="https://img.shields.io/npm/v/enmap.svg?maxAge=3600" alt="NPM version" /></a>
    <a href="https://www.npmjs.com/package/discord-yt-poster"><img src="https://img.shields.io/npm/dt/enmap.svg?maxAge=3600" alt="NPM downloads" /></a>
    <a href="https://discord.gg/FQGXbypRf8"><img src="https://maintained.cc/SDBagel/Maintained/2?" alt="Get Started Now"></a>
    <a href="https://www.patreon.com/MilratoDevelopment?fan_landing=true"><img src="https://img.shields.io/badge/donate-patreon-F96854.svg" alt="Patreon" /></a>
  </p>
  <p>
    <a href="https://nodei.co/npm/discord-yt-poster/"><img src="https://nodei.co/npm/discord-yt-poster.png?downloads=true&stars=true" alt="npm installnfo" /></a>
  </p>
</div>


# **discord-yt-poster**
>
> *Discord-yt-Poster is an automated, simple Package, which allows you to Easily integrate to your Discord Bot a Youtube Poster.*
> *This means, that it logs new Videos, or Streams and sends them to a Channel, you can define the Name, Link, User, and more!*
> *It is very fast and a scraper, so you don't need an API KEY.*
> *Also it is up to Date and includes JOSH, so you can decide if you wanna use the DEFAULT, JSON DB, or SQLITE, or Mongoos, so it works on repl.it too!*

## **Installation** 
```sh
npm install discord-yt-poster@latest
```

```js
const YoutubePoster = require("discord-yt-poster");
//Suggesting to require it once the bot is online, to reduce bugs...
client.on("ready", () => client.YTP = new YoutubePoster(client));
//use the methods
client.YTP.<Method>(<Options>); //returns -> Promise -> <OBJECT/ARRAY -- CHANNEL DATA>
//The logging is the package doing for you, you just need to use the setChannel() function in order to set the first channel which should get listened to!
```

## 📫 **Join our [Discord Server](https://discord.gg/FQGXbypRf8) for Support**

***

# 🗂 **For more help view [Documentation](https://github.com/Tomato6966/discord-yt-poster/wiki)**

***

## 😎 **Features**
> 
> - ⭐️ **No Api Key needed - scraping**
> - 🛠 **Easy to use** 
> - 👀 **Faster then light**
> - 💪 **Up to Date** 
> - 🤙 **Infinite Channels, with infite amount of options**
> - 🤖 **Flexible**

***

## 🧠 **Methods**
> 
> - [**See all Methods**](https://github.com/Tomato6966/discord-yt-poster/wiki/Methods)

***

## 🥰 **Examples**
> 
> - [**Basic Example Bot**](https://github.com/Tomato6966/discord-yt-poster/wiki/Basic-Example-Bot)
> - [**Example with all Commands**](https://github.com/Tomato6966/discord-yt-poster/wiki/Example-with-all-Commands)

***

## 🤩 **Responses**
> 
> - [**See all Responses**](https://github.com/Tomato6966/discord-yt-poster/wiki/Responses)
