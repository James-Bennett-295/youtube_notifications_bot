import { Notifier, Video } from "youtube-notifs";
import discord from "discord.js";
import cfg from "../config.json";

const client = new discord.Client({
	intents: [
		discord.GatewayIntentBits.Guilds
	]
});

client.once(discord.Events.ClientReady, (client) => {
	console.info(`Logged in as: ${client.user.tag}`);

	const channel = <discord.TextChannel>client.channels.cache.get(cfg.discordChannelId);

	const notifier = new Notifier(cfg.newVidCheckIntervalInSeconds, "./data.json");

	notifier.on("error", (err: Error) => {
		console.error(err);
	});

	if (cfg.debugModeEnabled) {
		notifier.on("debug", (log) => {
			console.debug(log);
		});
	}

	notifier.on("newVid", (video: Video) => {
		const msg = cfg.msg
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

	notifier.subscribe(cfg.subscriptions);

	notifier.start();
});

client.login(cfg.token);
