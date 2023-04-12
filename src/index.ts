import { Notifier, SubscriptionMethods, DataStorageMethods } from "youtube-notifs";
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

	const notifier = new Notifier({
		subscription: {
			method: SubscriptionMethods.Polling,
			interval: cfg.newVidCheckIntervalInMinutes
		},
		dataStorage: {
			method: DataStorageMethods.File,
			file: "./data.json"
		}
	});

	notifier.onError = console.error;

	if (cfg.debugModeEnabled) notifier.onDebug = console.debug;

	notifier.onNewVideo = (video) => {
		const msg = cfg.msg.replace(/\{(.+?)\}/g, (full, name: string) => ({
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
		})[name] ?? full);
		channel.send(msg);
	}

	notifier.subscribe(...cfg.subscriptions);

	notifier.start();
});

client.login(cfg.token);
