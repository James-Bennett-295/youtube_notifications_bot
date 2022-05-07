import fs from "node:fs";
import ytNotifs from "youtube-notifs";
import logger from "@james-bennett-295/logger";
import { Client, Intents } from "discord.js";

const cfg = JSON.parse(fs.readFileSync("./config.json"));

logger.config({
	debugEnabled: cfg.debugModeEnabled,
	useAnsiColours: cfg.ansiColoursEnabled
});

const client = new Client({
	intents: [
		Intents.FLAGS.GUILDS
	]
});

const notifier = new ytNotifs.Notifier("./yt-notifs-data.json", cfg.newVidCheckIntervalInSeconds);

notifier.on("error", (err) => {
	logger.error(err);
});

notifier.on("newVid", (obj) => {
	client.channels.cache.get(cfg.discordChannelId).send(ytNotifs.msg(cfg.msg, obj));
});

notifier.subscribe(cfg.subscriptions);

client.once("ready", () => {
	logger.info("Logged in as " + client.user.tag);
	notifier.start();
});

client.login(cfg.token);
