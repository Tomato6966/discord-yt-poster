// ************* IMPORT MODULES *************  //
const CronJob = require('cron').CronJob;
// ************ IMPORT FILE DATA ************* //
const { channelInfo } = require('./channelInfo.js')
const { delay } = require('./Util.js');


module.exports = (YTP) => {
        
    if(!YTP.options.loop_delays_in_min || !YTP.options.loop_delays_in_min) throw new Error("No Loop Delay added (YTP.options.loop_delays_in_min)")
    if(typeof YTP.options.loop_delays_in_min != "number") throw new Error("(YTP.options.loop_delays_in_min) is not a Number")
    
    var Jobyoutube = new CronJob(`0 */${YTP.options.loop_delays_in_min} * * * *`, async function(){
        check(); 
    }, null, true, 'America/Los_Angeles');
    Jobyoutube.start();


    
    /** Check the Videos, and if there is a valid video or not
      * @param
     */
    async function checkVideos(youtubeChannel, ChannelDATA){
        try{
            let lastVideos = await YTP.getLatestVideos(youtubeChannel);
            // If there isn't any video in the youtube channel, return
            if(!lastVideos || !lastVideos[0]) return false;
            // If the last video is the same as the last saved, return
            if(ChannelDATA.oldvid && (ChannelDATA.oldvid === lastVideos[0].id || ChannelDATA.oldvid.includes(lastVideos[0].id)))  return false;
            if(ChannelDATA.alrsent && (ChannelDATA.alrsent.includes(lastVideos[0].id)))  return false;
            return lastVideos[0];
        } catch {
            return false;
        }
    }


    /** Check all Database entries for latest Upload + Send it
      * @param
     */
    async function check(){
        //get the Keys
        var keys = await YTP.YTP_DB.keys;
        keys.forEach(async key => {
            //get the Channels from the key
            var allChannels = await YTP.YTP_DB.get(`${key}.channels`);
            //if no channels defined yet, return
            if(!allChannels || allChannels.length == 0) return;
            //loop through all yt channels
            allChannels.forEach(async (ChannelDATA, index) => {
                try{
                    //If there is no Channellink return
                    if(!ChannelDATA.YTchannel) return console.log(ChannelDATA.YTchannel)
                    //get the latest Youtube Channel Information (name, id, etc.)
                    let channelInfos = await YTP.getChannelInfo(ChannelDATA.YTchannel);
                    //if no channelInfos return
                    if(!channelInfos) return;
                    //get the latest video
                    let video = await checkVideos(channelInfos.url, ChannelDATA);
                    //if no video found, return error
                    if(!video) return; //not a latest video posted
                    //define a global dc channel variable
                    let DCchannel;
                    try{
                        //try to get a DC channel from cache
                        DCchannel = await YTP.client.channels.cache.get(ChannelDATA.DiscordChannel);
                        //if no Channel found, fetch it
                        if(!DCchannel) {
                            DCchannel = await YTP.client.channels.fetch(ChannelDATA.DiscordChannel);
                        }
                    } catch{
                        //Do some logging because it failed finding it
                        console.log(YTP.ytp_log + `Could not find the Discord Channel for ${ChannelDATA.YTchannel}\n${JSON.stringify(ChannelDATA)}`.italic.brightRed)
                        console.log(YTP.ytp_log + "Removing it from the DB...")
                        //delete the Channel
                        await YTP.deleteChannel(ChannelDATA.DiscordGuild, ChannelDATA.YTchannel)
                    }
                    //if no DC Channel found, return error
                    if(!DCchannel) return;               
                    //send the Message
                    await DCchannel.send(stringmsg(ChannelDATA.message));
                    //get the string message and replace the datas
                    function stringmsg(txt) {
                        return String(txt).replace(/{videourl}/ig, video.link)
                            .replace(/{video}/ig, video.link)
                            .replace(/{url}/ig, video.link)
                            .replace(/{videotitle}/ig, video.title)
                            .replace(/{name}/ig, video.title)
                            .replace(/{title}/ig, video.title)
                            .replace(/{videoauthorname}/ig, channelInfos.name)
                            .replace(/{authorname}/ig, channelInfos.name)
                            .replace(/{author}/ig, channelInfos.name)
                            .replace(/{creator}/ig, channelInfos.name)
                            .replace(/{creatorname}/ig, channelInfos.name)
                            .replace(/{discorduser}/ig, ChannelDATA.DiscordUser)
                            .replace(/{user}/ig, ChannelDATA.DiscordUser)
                            .replace(/{member}/ig, ChannelDATA.DiscordUser)
                    }
                    //set the new old vid to the latest send video
                    ChannelDATA.oldvid = video.id;
                    //push the data in the already sent ones, so it's never repeating again, if a reupload and delete after, etc.
                    ChannelDATA.alrsent.push(video.id)
                    //if the already sent starts to get to big, remove the end of it
                    if(ChannelDATA.alrsent.length > 5) {
                        ChannelDATA.alrsent.pop()
                    }
                    //replace item in the
                    allChannels[index] = ChannelDATA;
                    //set the new channels
                    await YTP.YTP_DB.set(`${ChannelDATA.DiscordGuild}.channels`, allChannels);
                   }catch (e){
                    console.log(String(e).grey)
                }
            })
        })
    }
}
