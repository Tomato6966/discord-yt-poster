
module.exports.delay = delay;
module.exports.size = size;
module.exports.isValidURL = isValidURL;

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
    return url.match(/^https?:\/\/(www\.)?youtube\.com\/(channel\/UC[\w-]{21}[AQgw]|(c\/|user\/)?[\w-]+)$/) != null
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
