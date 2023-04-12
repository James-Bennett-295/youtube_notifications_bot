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
    const notifier = new youtube_notifs_1.Notifier({
        subscription: {
            method: youtube_notifs_1.SubscriptionMethods.Polling,
            interval: config_json_1.default.newVidCheckIntervalInMinutes
        },
        dataStorage: {
            method: youtube_notifs_1.DataStorageMethods.File,
            file: "./data.json"
        }
    });
    notifier.onError = console.error;
    if (config_json_1.default.debugModeEnabled)
        notifier.onDebug = console.debug;
    notifier.onNewVideo = (video) => {
        const msg = config_json_1.default.msg.replace(/\{(.+?)\}/g, (full, name) => {
            var _a;
            return (_a = ({
                title: video.title,
                url: video.url,
                id: video.id,
                released: video.released.toString(),
                description: video.description,
                width: video.width.toString(),
                height: video.height.toString(),
                thumbWidth: video.thumb.width.toString(),
                thumbHeight: video.thumb.height.toString(),
                thumbUrl: video.thumb.url,
                channelTitle: video.channel.title,
                channelUrl: video.channel.url,
                channelId: video.channel.id,
                channelReleased: video.channel.released.toString()
            })[name]) !== null && _a !== void 0 ? _a : full;
        });
        channel.send(msg);
    };
    notifier.subscribe(...config_json_1.default.subscriptions);
    notifier.start();
});
client.login(config_json_1.default.token);
