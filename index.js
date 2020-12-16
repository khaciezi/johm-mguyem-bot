const { Client, MessageAttachment } = require('discord.js');
const ytdl = require('ytdl-core');
const fs = require('fs');
const Discord = require('discord.js');
const { prefix, token } = require('./config.json');
const client = new Discord.Client();
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

client.once('ready', () => {
	console.log('Ready!');
});

client.on('message', async message => {
	if (!message.content.startsWith(prefix) || message.author.bot) return;
	const args = message.content.slice(prefix.length).trim().split(/ +/);
	const commandName = args.shift().toLowerCase();
	if (!client.commands.has(commandName)) return;
	const command = client.commands.get(commandName)
		|| client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
	if (!command) return;
	if (message.channel.type === 'dm') {
		return message.reply('I can\'t execute that command inside DMs!');
	}
	try {
		command.execute(message, args);
	}
	catch (error) {
		console.error(error);
		message.reply('There was an error trying to execute that command!');
	}
	if (commandName === 'bruh') {
		const attachment = new MessageAttachment('https://media1.tenor.com/images/8daeb547b121eef5f34e7d4e0b88ea35/tenor.gif?itemid=5156041');
		message.channel.send(`${message.author},`, attachment);
	}
	if (message.member.voice.channel && commandName === 'join') {
		const connection = await message.member.voice.channel.join();
	}
	if (commandName === 'play') {
		if (message.member.voice.channel) {
			const connection = await message.member.voice.channel.join();
			connection.play(ytdl(`${args[0]}`, { filter: 'audioonly' }));
			message.channel.send('Now playing.');
		}
	}
	if (commandName === 'stop') {
		const connection = await message.member.voice.channel.join();
		const dispatcher = connection.play(`${args[0]}`);
		dispatcher.pause();
	}
	if (commandName === 'disconnect' || commandName === 'dc' || commandName === 'leave') {
		const connection = await message.member.voice.channel.join();
		connection.disconnect();
	}
	if (commandName === 'react') {
		message.react('😄');
	}
});
client.login(token);
