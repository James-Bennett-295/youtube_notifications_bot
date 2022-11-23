"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const youtube_notifs_1 = require("youtube-notifs");
const discord_js_1 = __importDefault(require("discord.js"));
const config_json_1 = __importDefault(require("../config.json"));
const client = new discord_js_1.default.Client({
    intents: [
        discord_js_1.default.GatewayIntentBits.Guilds
    ]
});
client.once(discord_js_1.default.Events.ClientReady, (client) => {
    console.info(`Logged in as: ${client.user.tag}`);
    const channel = client.channels.cache.get(config_json_1.default.discordChannelId);
    const notifier = new youtube_notifs_1.Notifier(config_json_1.default.newVidCheckIntervalInSeconds, "./data.json");
    notifier.on("error", (err) => {
        console.error(err);
    });
    if (config_json_1.default.debugModeEnabled) {
        notifier.on("debug", (log) => {
            console.debug(log);
        });
    }
    notifier.on("newVid", (video) => {
        const msg = config_json_1.default.msg
            .replace("{title}", video.title)
            .replace("{url}", video.url)
            .replace("{id}", video.id)
            .replace("{released}", video.released.toString())
            .replace("{description}", video.description)
            .replace("{width}", video.width.toString())
            .replace("{height}", video.height.toString())
            .replace("{thumbWidth}", video.thumb.width.toString())
            .replace("{thumbHeight}", video.thumb.height.toString())
            .replace("{thumbUrl}", video.thumb.url)
            .replace("{channelTitle}", video.channel.title)
            .replace("{channelUrl}", video.channel.url)
            .replace("{channelId}", video.channel.id)
            .replace("{channelReleased}", video.channel.released.toString());
        channel.send(msg);
    });
    notifier.subscribe(config_json_1.default.subscriptions);
    notifier.start();
});
client.login(config_json_1.default.token);
