const logger = require("@james-bennett-295/logger");
const ytNotifs = require("youtube-notifs");
const { Client, Intents } = require("discord.js");
const config = require("../config.json");

const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS
    ]
});

ytNotifs.events.on("newVid", (obj) => {
    client.channels.cache.get(config.discordChannelId).send(ytNotifs.msg(config.msg, obj));
});

client.once("ready", () => {
    logger.info("Logged in as " + client.user.tag);
    ytNotifs.start(
        config.newVidCheckIntervalInSeconds,
        "./data.json",
        config.preventDuplicateSubscriptions,
        config.dataFileAutoSaveIntervalInSeconds,
        config.debugModeEnabled
    );
    ytNotifs.subscribe(config.subscriptions);
});

client.login(config.token);
