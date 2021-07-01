"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(module.exports, "__esModule", { value: true });
module.exports.channelInfo = void 0;
const axios_1 = __importDefault(require("axios"));
const utils_1 = require("./Util.js");
/**
 * Get full information about a YouTube channel
 */
const channelInfo = (url, options = {}) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13, _14, _15, _16, _17, _18, _19, _20, _21, _22, _23, _24, _25, _26, _27, _28, _29, _30, _31, _32, _33;
    if (typeof url !== "string")
        throw new Error(utils_1.constants.err.type("url", "string", typeof url));
    if (typeof options !== "object")
        throw new Error(utils_1.constants.err.type("options", "object", typeof options));
    options = utils_1.mergeObj({
        requestOptions: {
            headers: {
                "User-Agent": utils_1.constants.headers.userAgent,
            },
        },
    }, options);
    if (!url.startsWith("http"))
        url = utils_1.constants.urls.channel.base(url);
    let res;
    try {
        res = (yield axios_1.default.get(url, Object.assign(Object.assign({}, options.requestOptions), { responseType: "text" }))).data;
    }
    catch (err) {
        throw new Error(`Failed to fetch site. (${err})`);
    }
    let initialData;
    try {
        initialData = JSON.parse((_a = res.split("var ytInitialData = ")[1]) === null || _a === void 0 ? void 0 : _a.split(";</script>")[0]);
    }
    catch (err) {
        throw new Error(`Failed to parse data from script tag. (${err})`);
    }
    const channel = {
        name: initialData?.metadata?.channelMetadataRenderer?.title,
        id: initialData?.metadata?.channelMetadataRenderer?.externalId,
        url: initialData?.metadata?.channelMetadataRenderer?.channelUrl,
        rssUrl: initialData?.metadata?.channelMetadataRenderer?.rssUrl,
        description: initialData?.metadata?.channelMetadataRenderer?.description,
        subscribers: initialData?.header?.c4TabbedHeaderRenderer?.subscriberCountText?.simpleText,
        banner: initialData?.header?.c4TabbedHeaderRenderer?.banner?.thumbnails?.sort((a, b) => b.width - a.width),
        tvBanner: initialData?.header?.c4TabbedHeaderRenderer?.tvBanner?.thumbnails?.sort((a, b) => b.width - a.width),
        mobileBanner: initialData?.header?.c4TabbedHeaderRenderer?.mobileBanner?.thumbnails?.sort((a, b) => b.width - a.width),
        tags: initialData?.metadata?.channelMetadataRenderer?.keywords.split(
            " "
        ),
        videos: ["USE THE FUNCTION: YTP.getLatestVideos(youtubeChannel)"],
        unlisted: initialData?.microformat?.microformatDataRenderer?.unlisted,
        familySafe: initialData?.metadata?.channelMetadataRenderer?.isFamilySafe,
    };
    return channel;
});
module.exports = channelInfo;
module.exports.channelInfo = channelInfo;
module.exports.default = module.exports.channelInfo;
