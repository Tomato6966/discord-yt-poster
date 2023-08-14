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

module.exports.delay = delay;
module.exports.size = size;
module.exports.isValidURL = isValidURL;
module.exports.replaceContents = replaceContents;

/** Check the Size of an Array / Object
  * @param {ARRAY/OBJECT} obj To Check 
*/ 
function size(obj) {
    if(Array.isArray(obj)) {
        return obj.length;
    } else {
        var size = 0,
            key;
        for (key in obj) {
            if (obj.hasOwnProperty(key)) size++;
        }
        return size;
    }
};


/** Check if the Link is a valid youtube Channel Link or not
  * @param {STRING} url To Check 
*/ 
function isValidURL(url){
  /*
    Updated this validation to support both the old youtube link system and the new one, also added support for when the user sends an id of the channel
    this works the three ways, might not be the best approach but it works.
  */
    const regex = /^(?:https?:\/\/(www\.)?youtube\.com\/((channel\/UC[\w-]{21}[AQgw])|(c\/|user\/)?[\w-]+|@[\w-]+))$|^UC[\w-]{21}[AQgw]$/;
    //Check if the url matches the format
    if (regex.test(url)) {
        //if the user inputs only the id, we add it to the url and return it after, otherwise we just return
        if (!url.startsWith("http")) {
            url = "https://www.youtube.com/channel/" + url;
        }
        return url;
    }
    //if it does not match, we return false wich should return the error message
    return false;
  }


/** Sleep for some Time
  * @param {NUMBER} delayInms To wait
*/ 
function delay(delayInms) {
  try {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(2);
      }, delayInms);
    });
  } catch (_) { }
}

/** Replaces the string content with video meta data
  * @param {NUMBER} delayInms String to replace
  * @param {OBJECT | VIDEO} video Data for replace
  * @param {OBJECT | channelInfos} channelInfos Data for replace
  * @param {OBJECT | ChannelDATA} ChannelDATA Data for replace
*/ 
function replaceContents(txt, video, channelInfos, ChannelDATA) {
    return String(txt).replace(/{videourl}/ig, video.link)
        .replace(/{video}/ig, video.link)
        .replace(/{url}/ig, video.link)
        .replace(/{link}/ig, video.link)
        .replace(/{vid}/ig, video.link)
        .replace(/{uri}/ig, video.link)

        .replace(/{videotitle}/ig, video.title)
        .replace(/{name}/ig, video.title)
        .replace(/{title}/ig, video.title)

        .replace(/{videoauthorname}/ig, channelInfos.name)
        .replace(/{authorname}/ig, channelInfos.name)
        .replace(/{author}/ig, channelInfos.name)
        .replace(/{channel}/ig, channelInfos.name)
        .replace(/{channelname}/ig, channelInfos.name)
        .replace(/{creator}/ig, channelInfos.name)
        .replace(/{creatorname}/ig, channelInfos.name)

        .replace(/{discorduser}/ig, ChannelDATA.DiscordUser)
        .replace(/{user}/ig, ChannelDATA.DiscordUser)
        .replace(/{member}/ig, ChannelDATA.DiscordUser)
}
"use strict";
Object.defineProperty(module.exports, "__esModule", { value: true });
module.exports.mergeObj = module.exports.constants = void 0;
module.exports.constants = {
    urls: {
        base: "https://www.youtube.com",
        search: {
            base: (terms) => `${module.exports.constants.urls.base}/results?search_query=${encodeURIComponent(terms)}`,
            filters: {
                video: "&sp=EgIQAQ%253D%253D",
                channel: "&sp=EgIQAg%253D%253D",
                playlist: "&sp=EgIQAw%253D%253D",
                film: "&sp=EgIQBA%253D%253D",
                programme: "&sp=EgIQBQ%253D%253D",
            },
        },
        video: {
            base: (id) => `${module.exports.constants.urls.base}/watch?v=${encodeURIComponent(id)}`,
        },
        playlist: {
            base: (id) => `${module.exports.constants.urls.base}/playlist?list=${encodeURIComponent(id)}`,
            baseUrlRegex: /^(http|https:\/\/).*\/playlist?.*list=\w+/,
            getIdRegex: /^(http|https:\/\/).*list=(\w+)/,
        },
        channel: {
            base: (id) => `${module.exports.constants.urls.base}/channel/${id}`,
        },
    },
    headers: {
        userAgent: "Mozilla/5.0 (Windows NT 6.1; WOW64; rv:54.0) Gecko/20100101 Firefox/54.0",
    },
    err: {
        type: (key, expected, received) => `Expected "${key}" to be "${expected}" but received "${received}".`,
    },
};
const merge2Obj = (one, two) => {
    for (const key in two) {
        if (Object.prototype.hasOwnProperty.call(two, key)) {
            const ele = two[key];
            if (typeof ele === "object")
                one[key] = merge2Obj(one[key], ele);
            else
                one[key] = ele;
        }
    }
    return one;
};
const mergeObj = (res, ...objs) => {
    objs.forEach((obj) => merge2Obj(res, obj));
    return res;
};
module.exports.mergeObj = mergeObj;
